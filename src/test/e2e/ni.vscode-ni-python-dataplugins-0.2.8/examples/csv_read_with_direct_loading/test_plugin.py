import unittest
import sys
from csv_read_with_direct_loading import Plugin


class BasicDataPluginTests(unittest.TestCase):

    def test_class_init(self):
        p = Plugin()
        self.assertIsInstance(p, Plugin)


if __name__ == '__main__':
    unittest.main()
