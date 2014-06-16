import os.path

import tornado.ioloop
import tornado.web
from tornado.options import define, options, parse_command_line


define('port', help=u'http server port', default=8001)
define('template_path', help='path to search templates',
    default=os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'templates')))


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html', title='Hello, World!')


if __name__ == '__main__':
    parse_command_line()
    settings = {
       'template_path': options.template_path,
    }
    app = tornado.web.Application(
        [
            (r'/', MainHandler),
        ],
        **settings
    )
    app.listen(options.port)

    tornado.ioloop.IOLoop.instance().start()
