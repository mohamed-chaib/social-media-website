let posts = document.getElementById("posts");
let currentPage = 1;
let lastPage = 1;
// infinite scroll
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage <= lastPage) {
    ++currentPage;
    getPosts(currentPage);
  }
});

// call the main function

getPosts();

// create one post

// GET POSTS
function getPosts(page = 1) {
  toggleLoader(true)
  let url = `${baseUrl}/posts?limit=4&page=${page}`;
  axios.get(url)
  .then((posts) => {
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
function createPostBtnClicked() {
  document.getElementById("post-modal-title").innerHTML = " Create Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-text").value = "";
  document.getElementById("post-id").value = "";
}
