function fetchdata() {
  fetch("http://localhost:3000/api/test-suit")
    .then((resp) => resp.json())
    .then((resp) => {
      // console.log("resp", resp);
      let select_type = document.getElementById("select_type");
      let inhtml = "";
      resp.map((i) => {
        inhtml = inhtml + `<option value="${i}">${i}</option>`;
      });
      select_type.innerHTML = inhtml;
    })
    .catch((err) => {
      console.log("err", err);
    });
}
function fetchSuit() {
  fetch("http://localhost:3000/api/test-hierarchy")
    .then((resp) => resp.json())
    .then((resp) => {
      //   console.log("resp", resp);
      let select_type = document.getElementById("select_type");
      let inhtml = "";
      Object.keys(resp).map((item) => {
        inhtml = inhtml + `<option value="${item}">${item}</option>`;
        // console.log("item", item);
      });
      select_type.innerHTML = inhtml;
    })
    .catch((err) => {
      console.log("err", err);
    });
}
function fetchTest() {
  fetch("http://localhost:3000/api/test-hierarchy")
    .then((resp) => resp.json())
    .then((resp) => {
      //   console.log("resp", resp);
      let select_type = document.getElementById("select_type");
      let inhtml = "";
      let allTest = [];
      Object.keys(resp).map((item) => {
        let tests = Object.keys(resp[item]);
        // console.log("tst", tests);
        tests.map((i) => {
          allTest.push(i);
        });
      });
      //   console.log("test case", allTest);
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
      let select_type = document.getElementById("select_type");
      let inhtml = "";
      let allTest = [];
      Object.keys(resp).map((item) => {
        let tests = Object.keys(resp[item]);
        // console.log("tst", tests);
        tests.map((i) => {
          //   console.log("i", i);
          let values_with_id = Object.values(resp[item][i]);
          values_with_id.map((v) => {
            // console.log("values", v, item, i);
            allTest.push(v);
          });
          // allTest.push(i);
        });
      });
      //   console.log("test case", allTest);
      allTest.map((test) => {
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

function main() {
  // DOM loaded
  //   fetchdata();
  //   fetchHierarchy();
}
document.addEventListener("DOMContentLoaded", main());
