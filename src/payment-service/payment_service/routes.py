from flask import Blueprint, request, g
from logger_config import logger
from db_connector import get_card_from_db, add_card_into_db
from util import (create_payment_response, create_json_message_object,
                  check_card_number_validity, check_expiry_date_validity, check_cvv_validity)

bp = Blueprint('routes', __name__)


@bp.route('/payment-info/<int:id>', methods=['POST'])
def add_card(id):
    data = request.get_json()
    logger.debug("Received request data: %s", data)
    card_holder_name = data['cardHolderName']
    card_number = data['cardNumber']
    expiry_date = data['expiryDate']
    cvv = data['cvv']

    number_validity = check_card_number_validity(card_number)
    expiry_date_validity = check_expiry_date_validity(expiry_date)
    cvv_validity = check_cvv_validity(cvv)

    response_messages = []

    if not number_validity:
        response_messages.append("Invalid card number")
    if not expiry_date_validity:
        response_messages.append("Invalid expiry date")
    if not cvv_validity:
        response_messages.append("Invalid CVV")

    if number_validity and expiry_date_validity and cvv_validity:
        logger.info("Credit card number is valid")
        data = add_card_into_db(id, card_holder_name, card_number, expiry_date, cvv)
        response = create_payment_response(data)
        return response
    else:
        logger.info(' '.join(response_messages))
        return create_json_message_object(response_messages), 400


@bp.route('/payment-info/<int:id>', methods=['GET'])
def get_card(id):
    data = get_card_from_db(id)
    response = create_payment_response(data)
    return response
