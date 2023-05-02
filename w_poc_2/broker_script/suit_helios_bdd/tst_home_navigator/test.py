import unittest
import io
import contextlib


class TestStringMethods(unittest.TestCase):

    def setUp(self):
        pass

    # Returns True if the string contains 4 a.
    def test_strings_a(self):
        f = io.StringIO()
        print(f.getvalue())
        # with self.assertRaises(SystemExit) as cm, contextlib.redirect_stderr(f):
        #     parser = target.parse_args([])
        self.assertEqual('a'*4, 'aaaa')
        for v in f.getvalue():
            print('values', v)
        # self.assertTrue(
        #     "error: one of the arguments -p/--propagate -cu/--cleanup is required" in f.getvalue())

    # Returns True if the string is in upper case.
    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    # Returns TRUE if the string is in uppercase
    # else returns False.
    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    # Returns true if the string is stripped and
    # matches the given output.
    def test_strip(self):
        s = 'geeksforgeeks'
        self.assertEqual(s.strip('geek'), 'sforgeeks')

    # Returns true if the string splits and matches
    # the given output.
    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        with self.assertRaises(TypeError):
            s.split(2)


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestStringMethods)
    result = unittest.TextTestRunner().run(suite)
    print('Total Test Run', result.testsRun)
    print('Total Fail', len(result.failures))
    # print('test result Errors', result.errors)
    # print('test result Skipped', result.skipped)
    # print('test result ExpectedFails', result.expectedFailures)
    # print('test result unexpected Success', result.unexpectedSuccesses)
    # unittest.main()
