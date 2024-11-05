let currentPage = 1;
let lastPage = 1;
// infinite scroll
window.addEventListener("scroll", () => {
  const endOfPage =window.innerHeight + window.scrollY >=  document.documentElement.scrollHeight;
  if (endOfPage && currentPage <= lastPage) {
    ++currentPage;
    getPosts(false,currentPage);
  }
});

// call the main function

getPosts();
function getPosts(reload=true,page = 1) { 
  toggleLoader(true)
  let url = `${baseUrl}/posts?limit=5&page=${page}`;
  axios.get(url)
  .   then((posts) => {
    if(reload){
      document.getElementById("posts").innerHTML=""
    }
      for (const post of posts.data.data) {
        createPost(post);
        lastPage = posts.data.meta.last_page;   
      }
    })
    .catch((err) => {
      console.log(err.message);
      showAlertMessage(err.message, "danger");
    })
    .finally(()=>{
      toggleLoader(false)
    })
}
// create one post

// GET POSTS

function createPostBtnClicked() {
  document.getElementById("post-modal-title").innerHTML = " Create Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-text").value = "";
  document.getElementById("post-id").value = "";
}
//ADD POST USER
function addPostUser(){
  const formData= new FormData();
  let token = localStorage.getItem("token")
  let image = document.getElementById("image-input-post").files[0]
  let body = document.getElementById("post-body-text").value
  let title = document.getElementById("post-title-input").value
  let postID= document.getElementById("post-id").value
  let isCreate = postID=="" || postID==null
  formData.append("image",image);
  formData.append("title",title);
  formData.append("body",body);  
  let url;
  if(isCreate){
    url=`${baseUrl}/posts`
  }
  else{
    url=`${baseUrl}/posts/${postID}`
    formData.append("_method","put")
  }
  axios.post(url,formData,{
    headers:{
     "Authorization"  : "Bearer "+ token,
    'Content-Type': 'multipart/form-data'
   }
}
).then((response)=>{
 showAlertMessage("Create Post Successfuly","success");
  document.getElementById("btn-close-create-post").click();
  console.log(true)
  getPosts()
 })
 .catch((err)=>{
  console.log(err)
  showAlertMessage(err.response.data.message,"danger");
 })
}