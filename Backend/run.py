# This file runs the server on the local host


from flask import Flask


def create_app(config_filename):
    # init Flask app
    app = Flask(__name__)
    app.config.from_object(config_filename)

    # import and init app BluePrint
    from app import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # connect to db
    from Model import db
    db.init_app(app)

    return app


# run app in debug mode for TESTIN PURPOSES ONLY
if __name__ == "__main__":
    app = create_app("config")
    app.run(debug=True)
