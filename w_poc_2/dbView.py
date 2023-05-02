from model import getData, setData
import json


def main():

    while True:
        print("1. Get list of test suit \n2. Get List of test case \n3. Get list of test case with request id.\n4. Exit")
        option = input("Choose your option.\n")
        if option == 4 or option == "4":
            print('Process ending.')
            break
        if option == 1 or option == "1":
            query = "SELECT ID, NAME FROM TEST_SUIT WHERE 1"
            resp = getData(query)
            resp = json.dumps(resp)
            print('response:', resp, '\n')
        if option == 2 or option == "2":
            query = "SELECT ID, NAME FROM TEST_CASE WHERE 1"
            resp = getData(query)
            resp = json.dumps(resp)
            print('response:', resp, '\n')
        if option == 3 or option == "3":
            query = "SELECT ID, NAME, REQ_ID FROM TEST_CASE WHERE 1"
            resp = getData(query)
            resp = json.dumps(resp)
            print('response:', resp, '\n')


main()
