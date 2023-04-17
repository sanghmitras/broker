from modal import getData, setData
import json


def main():
    # Step 1: Reading test suite from test_suite.json
    print('Step 1: Reading test_suite.json \n')
    test_suite = []
    with open('test_suite.json', 'r') as f:
        test_suite = json.load(f)

    print('Available test suites \n', test_suite)
    # this is comment
    # Step 2: pushing test suites in database
    print("Step 2: Pushing test suite names in database")
    query = "INSERT INTO TEST_SUITE (NAME, DESCRIPTION) VALUES (%s, %s)"
    values = []
    for elem in test_suite:
        values.append((elem, 'test suite description.'))
    status = setData(query, values)
    print('Data base push done. \n')

    # Step 3: reading dir_hierarchy.json
    print("Step 3: Reading test suite directory hierarchy\n")
    dir_hierarchy = {}
    with open('dir_hierarchy.json', 'r') as f:
        dir_hierarchy = json.load(f)
    print("Hierarchy:\n")
    print(dir_hierarchy)
    query = "SELECT * FROM TEST_SUITE WHERE 1"
    db_suite_data = getData(query)
    # print('db_suite_data\n', db_suite_data)
    # (test_case, test_suit_id, req_id)
    test_case_values = []
    for suite in db_suite_data:
        # print('suite', suite[0], suite[1])
        for key, val in dir_hierarchy[suite[1]].items():
            value = []
            print('key:', key, 'value:', val)
            value.append(key)  # pushing test case name
            value.append(suite[0])  # pushing fk_suite_id
            value.append(val['req_id'])  # pushing req_id
            test_case_values.append(tuple(value))

    print('All values', test_case_values)

    # Step 4: Pushing data to test case table of the database
    print("Step 4: Pushing data in test case table\n")

    query = "INSERT INTO TEST_CASE (NAME, FK_TEST_SUITE, REQ_ID) VALUES(%s, %s, %s)"
    setData(query, test_case_values)


main()
