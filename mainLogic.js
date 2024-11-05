const baseUrl = "https://tarmeezacademy.com/api/v1";
setUpUI();
// setUP the  UI
function setUpUI() {
  let token = localStorage.getItem("token");
  let nonLogedIn = document.getElementById("non-loged-in");
  let LogedIn = document.getElementById("loged-in");
  let addPost = document.getElementById("add-post");
  let sendComment = document.getElementById("send-comment");
  if (token == null) {
    nonLogedIn.classList.remove("d-none");
    LogedIn.classList.add("d-none");
    if (addPost != null) {
      addPost.classList.add("d-none");
    }
    if (sendComment != null) {
      sendComment.classList.add("d-none");
    }
  } else {
    if (addPost != null) {
      addPost.classList.remove("d-none");
    }
    if (sendComment != null) {
      sendComment.classList.remove("d-none");
    }
    LogedIn.classList.remove("d-none");
    nonLogedIn.classList.add("d-none");
    let user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("loged-in-profile").innerHTML = `
       <a class="navbar-brand " style="cursor:pointer" onclick="sendUserIdLogedIn()">
                <p class="fw-bold d-inline">${user.username}</p>
                <img src=${
                  typeof user.profile_image == "object"
                    ? ' "./images/default_profile_image.png"'
                    : user.profile_image
                } class="rounded-circle border border-2"style="width: 40px; height:40px ;" alt="profile">
        </a>
      `;
  }
}

// LOG OUT
function LogOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUpUI();
  showAlertMessage("log out succefully", "success");
}

// SHOW  ALERT
function showAlertMessage(message, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    '   <button id="close-alert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    `   <div>${message}</div>`,
    "</div>",
  ].join("");
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    document.getElementById("close-alert").click();
  }, 3000);
}

// regidter function
function register() {
  const formData = new FormData();
  let profileImage = document.getElementById("image-input");
  let name = document.getElementById("name-input");
  let username = document.getElementById("username-input");
  let password = document.getElementById("password-input");
  formData.append("image", profileImage.files[0]);
  formData.append("name", name.value);
  formData.append("username", username.value);
  formData.append("password", password.value);

  axios
    .post(baseUrl + "/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      document.getElementById("btn-close-sign-up").click();
      setUpUI();
      showAlertMessage("sign up succefully", "success");
    })
    .catch((err) => {
      console.log(err);
      showAlertMessage(err.response.data.message, "danger");
    });
}

// log in function
function logIn() {
  const username = document.getElementById("usernameLogIn");
  const password = document.getElementById("passwordLogIn");
  let params = {
    username: username.value,
    password: password.value,
  };
  axios
    .post(baseUrl + "/login", params)
    .then((response) => {
      showAlertMessage("log in succefully", "success");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      document.getElementById("btn-close-log-in").click();
      setUpUI();
    })
    .catch((err) => {
      console.log(err);
      showAlertMessage(err.response.data.message, "danger");
    });
}

// CREATE TAGS
function createTags(tags) {
  if (tags.length == 0) {
    return "";
  } else {
    let elem = document.createElement("span");
    for (const tag of tags) {
      elem.innerHTML += `
   <span class="badge rounded-pill text-bg-secondary">${tag.name}</span>
   `;
    }
    return elem.innerHTML;
  }
}

// CREATE ONE POST
function createPost(post) {
  let posts = document.getElementById("posts");
  let default_image = ' "./images/default_profile_image.png"';
  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");
  let profile_image =
    typeof post.author.profile_image == "object"
      ? default_image
      : post.author.profile_image;
  posts.innerHTML += `
    <!--POST -->
     <div class="post ">
       <div class="card shadow-sm ">
         <div class="card-header">
           <a class="navbar-brand " style="cursor:pointer"  onclick='sendUserId(${
             post.author.id
           })'>
             <img src=${profile_image} class="rounded-circle border border-2"style="width: 40px; height:40px ;" alt="profile">
             <p class="fw-bold d-inline">${post.author.username}</p>
           </a>
           <div class="${
             token != null
               ? post.author.id == user.id
                 ? ""
                 : "d-none"
               : "d-none"
           } float-end ">
             <button  type="button" class="btn btn-secondary " onclick="editPostBtnClicked('${encodeURIComponent(
               JSON.stringify(post)
             )}')">edit</button>
             <button type="button" class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(
               JSON.stringify(post)
             )}')">delete</button>
           </div>
         </div>
         <div class="card-body p-0" style="cursor:pointer" onclick='sendPostId(${
           post.id
         })' >
           <img src=${post.image} class="w-100"  alt="">
           <h6 class=" mt-3 text-body-secondary ps-3"> ${post.created_at}</h6>
           <h5 class="ps-3" >${post.title != null ? post.title : ""}</h5>
           <p class="ps-3">${post.body != null ? post.body : ""}</p>
         </div>
         <div class="card-footer text-body-secondary">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
             viewBox="0 0 16 16">
             <path
               d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
           </svg>
           <span style=" cursor:pointer; " > (${
             post.comments_count
           }) comments</span>
          ${createTags(post.tags)} 
           
         </div>
       </div>
     </div>
     <!--POST // -->
     `;
}

// SHOW TH MODAL OF DELETE POST BTN
function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-id-delete").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("deletePostModal"),
    {}
  );
  postModal.toggle();
}

//  CONFIRM  DELETE POST
function confirmPostBtnDelete() {
  let token = localStorage.getItem("token");

  const postId = document.getElementById("post-id-delete").value;
  let url = `${baseUrl}/posts/${postId}`;
  axios
    .delete(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      showAlertMessage("Create Post Successfuly", "success");
      document.getElementById("btn-close-create-post").click();
      location.reload();
    })
    .catch((err) => {
      console.log(err);
      showAlertMessage(err.response.data.message, "danger");
    });
}

// SHOW TH MODAL OF EDIT POST BTN
function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-title").innerHTML = " Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-text").value = post.body;
  document.getElementById("post-id").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("CreatePostModal"),
    {}
  );
  postModal.toggle();
}

// SEND POST ID TO posteDetails.html
function sendPostId(postId) {
  location.href = `./posteDetails.html?postId=${postId}`;
}

// SEND user ID TO profile.html
function sendUserId(userId) {
  location.href = `./profile.html?userId=${userId}`;
}

/*
//WHEN CLICK PROFILE  :
// SEND THE USER ID ID HE LOGED IN 
// ELSE : SHOW ALERT MESSAGE
*/
function sendUserIdLogedIn() {
  let token = localStorage.getItem("token");
  if (token != null) {
    let user = JSON.parse(localStorage.getItem("user"));
    location.href = `./profile.html?userId=${user.id}`;
  } else {
    showAlertMessage("you should sign up first ", "warning");
  }
}

// THE LOADER DISPLAY
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.display = "block";
  } else {
    document.getElementById("loader").style.display = "none";
  }
}
