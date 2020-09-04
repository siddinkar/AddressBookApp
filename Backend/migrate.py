# This file creates all the tables in the Model.py for the db specified in the config.py


from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from Model import db
from run import create_app

# create the db
app = create_app('config')

# create the tables and migrate
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
