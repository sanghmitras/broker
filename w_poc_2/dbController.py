from model import getData, setData
import json


def main():
    # Step 1: Reading test suit from test_suit.json
    print('Step 1: Reading test_suit.json \n')
    test_suit = []
    with open('test_suit.json', 'r') as f:
        test_suit = json.load(f)

    print('Available test suits \n', test_suit)
    # this is comment
    # Step 2: pushing test suits in database
    print("Step 2: Pushing test suit names in database")
    query = "INSERT INTO TEST_SUIT (NAME, DESCRIPTION) VALUES (%s, %s)"
    values = []
    for elem in test_suit:
        values.append((elem, 'test suit description.'))
    status = setData(query, values)
    print('Data base push done. \n')

    # Step 3: reading dir_hierarchy.json
    print("Step 3: Reading test suit directory hierarchy\n")
    dir_hierarchy = {}
    with open('dir_hierarchy.json', 'r') as f:
        dir_hierarchy = json.load(f)
    print("Hierarchy:\n")
    print(dir_hierarchy)
    query = "SELECT * FROM TEST_SUIT WHERE 1"
    db_suit_data = getData(query)
    # print('db_suit_data\n', db_suit_data)
    # (test_case, test_suit_id, req_id)
    test_case_values = []
    for suit in db_suit_data:
        # print('suit', suit[0], suit[1])
        for key, val in dir_hierarchy[suit[1]].items():
            value = []
            value.append(key)  # pushing test case name
            value.append(suit[0])  # pushing fk_suit_id
            value.append(val['req_id'])  # pushing req_id
            test_case_values.append(tuple(value))

    print('All values', test_case_values)

    # Step 4: Pushing data to test case table of the database
    print("Step 4: Pushing data in test case table\n")

    query = "INSERT INTO TEST_CASE (NAME, FK_TEST_SUITE, REQ_ID) VALUES(%s, %s, %s)"
    setData(query, test_case_values)


main()
