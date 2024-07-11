from flask import Flask
from db_connector import init_db
from logger_config import logger
import os
import routes


def create_app():
    flask_app = Flask(__name__)
    with flask_app.app_context():
        init_db()
        flask_app.register_blueprint(routes.bp)
    return flask_app


def get_env_var(env_string):
    env_string = os.environ[env_string]
    return int(env_string) if env_string else None


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=get_env_var('SERVER_PORT'))
    logger.info("Server started")

