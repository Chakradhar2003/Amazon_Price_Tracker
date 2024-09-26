from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from notifypy import Notify
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient


client = MongoClient("mongodb+srv://amazon:amazon@amazon.yfsnm.mongodb.net/?retryWrites=true&w=majority&appName=Amazon")
db = client["amazon"]
collection = db["prices"]

import time 
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def notify():
    notification = Notify()
    notification.title = "Extracting Data"
    notification.message = "Extracting data from Amazon"
    notification.send()

def get_data():
    # Ensure the output directory exists
    if not os.path.exists("data"):
        os.makedirs("data")
    options = Options()
    options.add_argument("--headless")
    # options.add_argument("--proxy-server")  
    with open("products.txt") as f:
        products = f.readlines()
    driver = webdriver.Chrome(options=options)
    for product in products:
        driver.get(f"https://www.amazon.in/dp/{product}")
        time.sleep(2)
        page_source = driver.page_source
        with open(f"data/{product.strip()}.html","w",encoding="utf-8") as f:
            f.write(page_source)


def extract_data():
    files = os.listdir("./data")
    for file in files:
        with open(f"data/{file}",encoding="utf-8") as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        title = soup.title.getText().split(":")[0]
        time = datetime.now()
        
        price = soup.find(class_="a-price-whole")
        priceInt = price.get_text().replace(",","").rstrip(".")
        table = soup.find(id = "productDetails_techSpec_section_1")
        for row in table.find_all('tr'):
            if 'ASIN' in row.th.get_text():
                asin = row.td.get_text().strip().replace('\u200e', '')
                break
        collection.insert_one({
            "price":priceInt,
            "asin":asin,
            "title":title,
            "time":time
        })

if __name__=="__main__":
    notify()
    extract_data()