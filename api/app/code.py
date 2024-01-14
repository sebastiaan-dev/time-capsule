from collections import namedtuple
from .config import settings

Response = namedtuple('Response', ['code', 'message'])

success = Response(1000, "Success")

param_error = Response(2000, "parameter error")
param_title_error = Response(2001, f"the length of title is less than {settings.MIN_TITLE_LEN}")
param_message_error = Response(2002, f"the length of message is less than {settings.MIN_TITLE_LEN}")
param_expire_error = Response(2003, f"the open date is longer than {settings.MAX_EXPIRE_DAY}")

server_error = Response(4000, f"server internal error")
