window.onload = function () {
  let username;
  let senderId;
  let receiverId;
  let dynamicId;
  let dynamiChatId;
  let dynamicSendMsg;
  let users = [];
  let chatWithUserIds = [];

  let e = document.getElementById("login-button");
  if (e) {
    document
      .getElementById("username-input")
      .addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
          document.getElementById("login-button").click();
        }
      });

    document
      .getElementById("toSendMsgUser")
      .addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
          document.getElementById("toSubcribeUser").click();
        }
      });

    document
      .getElementById("toSubcribeUser")
      .addEventListener("click", function () {
        receiverId = document.getElementById("toSendMsgUser").value;
        dynamicId = receiverId;
        receiverId = +receiverId;
        document.getElementById("toSendMsgUser").value = "";

        if (!chatWithUserIds.includes(receiverId) && senderId !== receiverId) {
          appendNewChatScreen(receiverId);
        }
      });

    io.socket.get("/user/list", function (userList, res) {
      users = userList.sort((a, b) => a.id - b.id);
      addUsersInDOM(users);
    });

    e.addEventListener("click", function () {
      username = document.getElementById("username-input").value;

      io.socket.post(
        "/create-user",
        { username: username },
        function (body, response) {
          document.getElementById("username-input").value = "";

          document
            .getElementById("user")
            .insertAdjacentHTML(
              "beforeend",
              `<h1> Your Username is : <b>${username}</b></h1>`
            );

          console.log(
            "----- user created and subscribed also with saved id -----"
          );
          senderId = response.body.id;
          if (!body) {
            window.location.reload();
          }

          document.getElementById("first-time-username").remove();
        }
      );
    });
  }

  document.addEventListener(
    "keyup",
    function (e) {
      let id = e.target.id;
      if (
        id.startsWith("chat-with") &&
        e.keyCode === 13 &&
        document.getElementById(id).value !== ""
      ) {
        let lastChar = id.substr(id.length - 1);
        lastChar = +lastChar;
        receiverId = lastChar;
        dynamicId = lastChar;
        dynamiChatId = id;
        dynamicSendMsg = "send-to-" + lastChar;
        document.getElementById(dynamicSendMsg).click();
      }
    },
    false
  );

  document.addEventListener(
    "click",
    function (e) {
      let id = e.target.id;
      if (id.startsWith("send-to")) {
        let lastChar = id.substr(id.length - 1);
        lastChar = +lastChar;
        receiverId = lastChar;
        dynamicId = lastChar;
        dynamicSendMsg = id;
        dynamiChatId = "chat-with-" + lastChar;

        if (document.getElementById(dynamiChatId).value !== "") {
          console.log({ dynamiChatId, dynamicId, dynamicSendMsg, receiverId });

          let msgValue = document.getElementById(dynamiChatId).value;
          appendChatMessage(username, msgValue, dynamicId);
          sendMessage(msgValue);
        }
      }
    },
    false
  );

  function sendMessage(msg) {
    console.log("----- sendMessage -----");
    io.socket.post(
      "/chat/msg",
      { msg: msg, user: username, senderId: senderId, receiverId: receiverId },
      function (body, response) {
        document.getElementById(dynamiChatId).value = "";
        if (!body) {
          window.location.reload();
        }
      }
    );
  }

  io.socket.on("connect", function socketConnected() {
    console.log("----- socket connect -----");

    io.socket.on("user-list", function onServerSentEvent(userList) {
      if (userList && userList.users && userList.users.length) {
        users = userList.users.sort((a, b) => a.id - b.id);
        addUsersInDOM(users);
      }
    });

    io.socket.on("user", function onServerSentEvent(msg) {
      console.log("----- user event -----");

      if (msg && senderId !== msg.senderId) {
        receiverId = msg.senderId;
        dynamicId = msg.senderId;
        dynamicId = dynamicId.toString();
        dynamiChatId = "chat-with-" + msg.senderId;
        dynamicSendMsg = "send-to-" + msg.senderId;

        if (chatWithUserIds.includes(msg.senderId)) {
          console.log("----- chat screen already exists -----");
          appendChatMessage(msg.user, msg.msg, dynamicId);
        } else {
          console.log("----- new chat screen arrives -----");
          chatWithUserIds.push(msg.senderId);

          document.getElementById("chat-screen").insertAdjacentHTML(
            "beforeend",
            `<div class="box">
                    <h1 class="display-5">Chat Screen With ${msg.user}</h1>
                    <br>
                    <div id=${dynamicId} class="card"> <div> ${msg.user} : ${msg.msg} </div></div>
                    <br>
                    <input type="text" id=${dynamiChatId} autofocus="autofocus" class="form-control" name="msg" placeholder="Enter a message..." />
                    <br>
                    <button id=${dynamicSendMsg} class="send-chat-button btn btn-primary">Send Message</button>
                    </div>
                    <br>`
          );

          window.scroll({
            top: 2500,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    });
  });

  function appendChatMessage(username, msgValue, dynamicId) {
    console.log({ dynamicId });
    let node = document.createElement("div");
    let data = `${username} : ${msgValue}`;
    let textnode = document.createTextNode(data);
    node.appendChild(textnode);
    document.getElementById(dynamicId).appendChild(node);
  }

  function appendNewChatScreen(userId) {
    if (username) {
      let user = users.find((a) => a.id === userId);
      dynamicId = userId;
      dynamiChatId = "chat-with-" + userId;
      dynamicSendMsg = "send-to-" + userId;
      dynamicId = dynamicId.toString();
      chatWithUserIds.push(userId);
      console.log("chatWithUserIds :", chatWithUserIds);

      if (user && user.username) {
        document.getElementById("chat-screen").insertAdjacentHTML(
          "beforeend",
          `<div class="box">
            <h1 class="display-5">Chat Screen With ${user.username}</h1>
            <br>
            <div id=${dynamicId} class="card"></div>
            <br>
            <input type="text" id=${dynamiChatId} autofocus="autofocus" class="form-control" name="msg" placeholder="Enter a message..." />
            <br>
            <button id=${dynamicSendMsg} class="send-chat-button btn btn-primary">Send Message</button>
            </div>
            <br>`
        );

        window.scroll({
          top: 2500,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }

  function addUsersInDOM(users) {
    if (users && users.length) {
      console.log("Connected Users :", users);
      let d1 = document.getElementById("users");
      d1.innerHTML = "";
      for (let i = 0; i < users.length; i++) {
        d1.insertAdjacentHTML(
          "beforeend",
          `<tr> <th scope="row">${users[i].id}</th>
                <td>${users[i].username}</td> 
                </tr>`
        );
      }
    } else {
      let d1 = document.getElementById("users");
      d1.insertAdjacentHTML(
        "afterbegin",
        `<tr> <th scope="row">-</th><td>-</td> </tr>`
      );
    }
  }
};
