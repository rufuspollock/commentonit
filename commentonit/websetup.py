"""Setup the commentonit application"""
import logging

from commentonit.config.environment import load_environment
import commentonit.model as model

log = logging.getLogger(__name__)

def setup_app(command, conf, vars):
    """Place any commands to setup commentonit here"""
    load_environment(conf.global_conf, conf.local_conf)

    model.repo.create_db()

