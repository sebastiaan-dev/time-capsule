from collections import namedtuple

Response = namedtuple('Response', ['code', 'message'])

Success = Response(1000, "Success")