from flask import jsonify
from logger_config import logger
import re


class OperationResult:
    RETRIEVED = 1
    UPDATED = 2
    INSERTED = 3
    NOT_FOUND = 4
    SERVER_ERROR = 5


def create_json_card_object(card_row):
    """ Create a card object from the database row
    :param card_row: row from the database
    :return: card object in dictionary format as json e.g.
    {
        "cardHolderName": "John Doe",
        "cardNumber": "123456789012,
        "expiryDate": "12/23",
        "cvv": "123"
    }"""
    return jsonify({
        "cardHolderName": card_row[1],
        "cardNumber": card_row[2],
        "expiryDate": card_row[3],
        "cvv": card_row[4]
    })


def create_json_message_object(message):
    """ Create a simple message object in json"""
    return jsonify({
        "message": message
    })


def create_payment_response(card):
    """ Create a response object based on the card data as a tuple
    :param card: a tuple with card data or a message and status @see OperationResult
    :return: json response object as a tuple with the card data and status e.g. (card, status)"""

    data = card[0]  # data is the first element in the tuple
    status = card[1]  # status is the second element in the tuple
    if status == OperationResult.RETRIEVED or status == OperationResult.UPDATED:
        return create_json_card_object(data), 200
    elif status == OperationResult.INSERTED:
        return create_json_message_object(data), 201
    elif status == OperationResult.NOT_FOUND:
        return create_json_message_object(data), 404
    else:
        logger.error("Server error")
        return create_json_message_object("Internal server error"), 500


def check_card_number_validity(card_number):
    """ Check if the credit card number is valid using the Luhn algorithm
    :param card_number: credit card number
    :return: True if the credit card number is valid, False otherwise"""

    # Luhn algorithm
    card_number = [int(x) for x in card_number]
    check_digit = card_number.pop()
    card_number.reverse()
    for i in range(0, len(card_number), 2):
        card_number[i] *= 2
        if card_number[i] > 9:
            card_number[i] -= 9
    return (sum(card_number) + check_digit) % 10 == 0


def check_expiry_date_validity(expiry_date):
    """ Check if the expiry date of the credit card is valid and matches given regex
    :param expiry_date: expiry date of the credit card
    :return: True if the expiry date is valid, False otherwise"""

    return re.match(r"^(0[1-9]|1[0-2])/\d{2}$", expiry_date) is not None


def check_cvv_validity(cvv):
    """ Check if the cvv of the credit card is a number of 3 digits
    :param cvv: cvv of the credit card
    :return: True if the cvv is valid, False otherwise"""

    return re.match(r"^\d{3}$", cvv) is not None
