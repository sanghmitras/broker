var test_hierarchy = {};
var testCaseCovered = [];
function fetchdata() {
  fetch("http://localhost:3000/api/test-suit")
    .then((resp) => resp.json())
    .then((resp) => {
      // console.log("resp", resp);
      let select_type = document.getElementById("select_type");
      let inhtml = "<option value='null'>Select</option>";
      resp.map((i) => {
        inhtml = inhtml + `<option value="${i}">${i}</option>`;
      });
      select_type.innerHTML = inhtml;
    })
    .catch((err) => {
      console.log("err", err);
    });
}
// function fetchSuit() {
//   fetch("http://localhost:3000/api/test-hierarchy")
//     .then((resp) => resp.json())
//     .then((resp) => {
//       //   console.log("resp", resp);
//       let select_type = document.getElementById("select_type");
//       let inhtml = "<option value='select' >select</option>";
//       Object.keys(resp).map((item) => {
//         inhtml = inhtml + `<option value="${item}">${item}</option>`;
//         // console.log("item", item);
//       });

//       select_type.innerHTML = inhtml;
//     })
//     .catch((err) => {
//       console.log("err", err);
//     });
// }
function fetchTest() {
  fetch("http://localhost:3000/api/test-hierarchy")
    .then((resp) => resp.json())
    .then((resp) => {
      test_hierarchy = resp;
      let select_type = document.getElementById("select_type");
      let inhtml = "<option value='null' >select</option>";
      let allTest = [];
      Object.keys(resp).map((item) => {
        let tests = Object.keys(resp[item]);
        tests.map((i) => {
          allTest.push(`${item} > ${i}`);
        });
      });
      allTest.map((test) => {
        inhtml = inhtml + `<option value="${test}">${test}</option>`;
      });

      select_type.innerHTML = inhtml;
    })
    .catch((err) => {
      console.log("err", err);
    });
}
function fetchId() {
  fetch("http://localhost:3000/api/test-hierarchy")
    .then((resp) => resp.json())
    .then((resp) => {
      //   console.log("resp", resp);
      test_hierarchy = resp;
      let select_type = document.getElementById("select_type");
      let inhtml = `<option value="select">Select</option>`;
      let allTest = [];
      Object.keys(resp).map((item) => {
        let tests = Object.keys(resp[item]);
        // console.log("tst", tests);
        tests.map((i) => {
          //   console.log("i", i);
          id = resp[item][i]["req_id"];
          allTest.push(id);
          // let values_with_id = Object.values(resp[item][i]);
          // values_with_id.map((v) => {
          //   console.log("values", v, item, i);

          //   if (v === "req_id") {
          //     allTest.push(v);
          //   }
          // });
          // allTest.push(i);
        });
      });
      //   console.log("test case", allTest);
      //   console.log("allTest", allTest);
      let obj = {};
      allTest.map((i) => {
        obj[i] = i;
      });
      Object.keys(obj).map((test) => {
        inhtml = inhtml + `<option value="${test}">${test}</option>`;
      });

      select_type.innerHTML = inhtml;
    })
    .catch((err) => {
      console.log("err", err);
    });
}

function handleTypeChange() {
  let seleted_by = document.getElementById("select_by");
  const test_suits_covered = document.getElementById("test-suits-covered");
  test_suits_covered.innerHTML = "";
  switch (seleted_by.value) {
    case "suit": {
      fetchdata();
      break;
    }
    case "test_case": {
      fetchTest();
      break;
    }
    case "id": {
      fetchId();
      break;
    }
  }
  //   fetchHierarchy();
}
function kickStart() {
  let payload = {
    selectedTest: testCaseCovered,
  };
  fetch("http://localhost:3000/api/kick-start", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      console.log("resp", resp, testCaseCovered);
    })
    .catch((e) => {});
}

function getResult() {
  fetch("http://localhost:3000/api/test-result")
    .then((resp) => resp.json())
    .then((resp) => {
      console.log("result", resp);
      let result_box = document.getElementById("result-box");
      let html = `<div style="padding:10px; background:darkcyan; font-weight: 700; color: white; margin-top: 20px;">Test Results</div> 
      <table>
      <thead> <td>Suit</td> <td>Test Case</td><td>Date</td><td>Result</td>
      </thead>
      <tbody>`;
      resp.map((item) => {
        html =
          html +
          `<tr><td>${item.suit}</td> <td>${item.testCase}</td> <td>${item.date}</td> <td>${item.result}</td></tr>`;
      });
      html = html + `</tbody></table>`;
      result_box.innerHTML = html;
    })
    .catch((err) => {
      console.log("err", err);
    });
}

function handleSelectChange() {
  let select = document.getElementById("select_type");
  let select_by = document.getElementById("select_by");
  console.log("selected value", select_by.value);
  if (select_by.value === "id") {
    let selected_id = select.value;
    let payload = { id: selected_id, type: "req_id" };
    fetch("http://localhost:3000/api/test-case-by-id", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log("resp", resp);
        let test_suits_covered = document.getElementById("test-suits-covered");
        let html = `<div style="padding:10px; background:darkcyan; font-weight: 700; color: white; margin-top: 20px;">Test Cases Covered</div>`;
        let testCaseCovered_local = [];
        resp.data2.map((element, index) => {
          // console.log("element", element);
          testCaseCovered_local.push({
            suit: element.name,
            testCase: element.test_case_name,
          });
          html =
            html +
            `<div style="margin-top:10px; background:#f2f2f2;padding-left:10px">${
              index + 1
            }. ${element.name}:-> ${element.test_case_name}</div>`;
        });
        test_suits_covered.innerHTML = html;
        testCaseCovered = testCaseCovered_local;
      });
    console.log("values", Object.values(test_hierarchy));
  } else if (select_by.value === "suit") {
    let selected_id = select.value;
    let payload = { id: selected_id, type: "suit" };
    fetch("http://localhost:3000/api/test-case-by-id", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log("resp", resp);
        let testCaseCovered_local = [];
        let test_suits_covered = document.getElementById("test-suits-covered");
        let html = `<div style="padding:10px; background:darkcyan; font-weight: 700; color: white; margin-top: 20px;">Test Cases Covered</div>`;
        resp.data.map((element, index) => {
          testCaseCovered_local.push({ suit: selected_id, testCase: element });
          html =
            html +
            `<div style="margin-top:10px; background:#f2f2f2;padding-left:10px">${
              index + 1
            }. ${element}</div>`;
        });
        test_suits_covered.innerHTML = html;
        testCaseCovered = testCaseCovered_local;
      });
    console.log("values", Object.values(test_hierarchy));
  } else if (select_by.value === "test_case") {
    console.log("select value", select.value);
    let testcase = select.value.split(">")[1];
    let testsuit = select.value.split(">")[0];
    testCaseCovered = [{ suit: testsuit.trim(), testCase: testcase.trim() }];
    console.log("test coverd changed", testCaseCovered);
  }
}
function main() {
  // DOM loaded
  //   fetchdata();
  //   fetchHierarchy();
}
document.addEventListener("DOMContentLoaded", main());
