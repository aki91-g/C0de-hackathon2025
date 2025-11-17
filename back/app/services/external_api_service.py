# app/services/external_api_service.py - 外部API連携とデータマッピングロジック 
# 動作確認：http://localhost:3000/api/books/

import httpx
import os
import xml.etree.ElementTree as ET
import asyncio
import logging
from typing import Optional
from dotenv import load_dotenv
from models.external_book import BookInfo

logger = logging.getLogger(__name__)

load_dotenv()

GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
NDL_SEARCH_API_URL = os.getenv("NDL_SEARCH_API_URL")


async def fetch_book_from_google_books(isbn: str) -> Optional[BookInfo]:
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={GOOGLE_BOOKS_API_KEY}"
            response = await client.get(url)
            print(f"DEBUG: Google Status Code: {response.status_code}")
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            data = response.json()

            if data["totalItems"] > 0:
                book_data = data["items"][0]["volumeInfo"]
                title = book_data.get("title", "")
                authors = book_data.get("authors", [""])
                publisher = book_data.get("publisher")
                published_date = book_data.get("publishedDate")
                image_links = book_data.get("imageLinks")
                cover_image_url = image_links.get("thumbnail") if image_links else None

                return BookInfo(
                    isbn=isbn,
                    title=title,
                    author=", ".join(authors),
                    publisher=publisher,
                    publication_date=published_date,
                    cover_image_url=cover_image_url,
                )
            else:
                return None
    except httpx.HTTPStatusError as e:
        logger.error(f"Google Books: HTTP error occurred for ISBN {isbn}: Status={e.response.status_code}. Detail={e}")
        logger.debug(f"Google Response Text: {e.response.text}")
        return None
    except Exception as e:
        logger.error(f"Google Books: Unexpected error occurred for ISBN {isbn}: {e}")
        return None


NDL_NAMESPACES = {
    'sru': 'http://www.loc.gov/zing/srw/',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'dcterms': 'http://purl.org/dc/terms/',
    'rss': 'http://purl.org/rss/1.0/'
}

def _map_ndl_data(isbn: str, xml_content) -> Optional[BookInfo]:
    try:
        root = ET.fromstring(xml_content)
        record = root.find('.//sru:record', NDL_NAMESPACES)
        if record is None:
            return None
        
        title_element = record.find('.//dc:title', NDL_NAMESPACES)
        publisher_element = record.find('.//dc:publisher', NDL_NAMESPACES)
        date_element = record.find('.//dc:date', NDL_NAMESPACES)
        
        authors = [elem.text for elem in record.findall('.//dc:creator', NDL_NAMESPACES)]
        author_str = ", ".join(authors) if authors else "unknown"

        published_date = date_element.text if date_element is not None else None

        return BookInfo(
            isbn=isbn,
            title=title_element.text if title_element is not None else 'unknown title',
            author=author_str,
            publisher=publisher_element.text if publisher_element is not None else 'unknown publisher',
            publication_date=published_date,
            source="NDL Search"
        )
    
    except ET.ParseError as e:
        logger.error(f"NDL XML loading error occurred for ISBN {isbn}: {e}")
        return None
    except Exception as e:
        logger.error(f"NDL data mapping error occurred for ISBN {isbn}: {e}")
        return None


async def fetch_book_from_ndl(isbn: str) -> Optional[BookInfo]:
    """
    ISBNを元に国立国会図書館サーチAPI (SRU) を呼び出し、書籍情報を取得する。
    httpxのparams機能でURLエンコーディングとSRUクエリの構築を自動化。
    """
    params = {
        "operation": "searchRetrieve",
        "version": "1.2",
        "query": f"isbn={isbn}", # search by isbn with CQL
        "recordPacking": "xml",
        "recordSchema": "dc", # Dublin Core style
    }
    
    await asyncio.sleep(0.1)

    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            response = await client.get(NDL_SEARCH_API_URL, params=params)
            if 400 <= response.status_code < 600:
                response.raise_for_status()
            
            return _map_ndl_data(isbn, response.text) 
            
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            logger.warning("NDL Search: 429 Too Many Requests (Rate Limit Hit)")
        else:
            logger.error(f"NDL Search: HTTP Status Error for ISBN {isbn}. Status: {e.response.status_code}. Detail: {e}")
        return None
            
    except httpx.RequestError as e:
        logger.error(f"NDL Search: Request error for ISBN {isbn} (Network/Timeout): {e}")
        return None
            
    except Exception as e:
        logger.error(f"NDL Search: Unexpected error for ISBN {isbn}: {e}")
        return None



async def get_book_info(isbn: str) -> Optional[BookInfo]:
    book = await fetch_book_from_google_books(isbn)
    if book:
        return book
    book = await fetch_book_from_ndl(isbn)
    if book:
        return book
    return None