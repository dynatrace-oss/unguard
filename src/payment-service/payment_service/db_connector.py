import sqlite3
from logger_config import logger
from sqlite3 import Error
from util import OperationResult
from flask import g

DATABASE = r'./payment-info.db'


def create_connection():
    """ Create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(DATABASE)
    except Error as e:
        logger.error("Connection to SQLite DB failed: %s", e)
    return conn


def init_db():
    db = create_connection()
    create_table(db)
    logger.info("Database initialized")


def create_table(conn):
    """ create a table for storing credit card information """
    try:
        sql_create_cards_table = """ CREATE TABLE IF NOT EXISTS cards (
                                        id integer PRIMARY KEY,
                                        card_holder_name text NOT NULL,
                                        card_number text NOT NULL,
                                        expiry_date text NOT NULL,
                                        cvv text NOT NULL
                                    ); """
        conn.execute(sql_create_cards_table)
    except Error as e:
        logger.error("Table creation failed: %s", e)


def execute_query(query):
    row = None
    conn = create_connection()
    try:
        if conn is not None:
            logger.debug("Executing query: %s", query)
            cur = conn.cursor()
            cur.execute(query)
            row = cur.fetchone()
            conn.commit()
    except Error as e:
        logger.error("Query execution failed: %s", e)
        raise e
    finally:
        if conn is not None:
            conn.close()
    return row


def get_card_from_db(user_id):
    """ Retrieve a credit card from the database
    :param user_id: id of the card"""
    try:
        query = "SELECT * FROM cards WHERE id = " + str(user_id)
        data = execute_query(query)
        if data is not None:
            return data, OperationResult.RETRIEVED
        else:
            return "Credit card information not found", OperationResult.NOT_FOUND
    except Error:
        return "Server error", OperationResult.SERVER_ERROR


def add_card_into_db(user_id, card_holder_name, card_number, expiry_date, cvv):
    """ Add card into the database or update the card information if it already exists
    :param user_id: id of the card
    :param card_holder_name: name of the card holder
    :param card_number: card number
    :param expiry_date: expiry date of the card
    :param cvv: cvv of the card"""

    try:
        query = "SELECT * FROM cards WHERE id = " + str(user_id)
        row = execute_query(query)
        if row is not None:
            query = "UPDATE cards SET card_holder_name = '" + card_holder_name + "', card_number = '" + card_number + "', expiry_date = '" + expiry_date + "', cvv = '" + cvv + "' WHERE id = " + str(user_id)
            execute_query(query)
            return "Card updated successfully", OperationResult.UPDATED
        else:
            query = "INSERT INTO cards (id, card_holder_name, card_number, expiry_date, cvv) VALUES (" + str(user_id) + ", '" + card_holder_name + "', '" + card_number + "', '" + expiry_date + "', '" + cvv + "')"
            execute_query(query)
            return "Card added successfully", OperationResult.INSERTED
    except Error:
        return "Server error", OperationResult.SERVER_ERROR
