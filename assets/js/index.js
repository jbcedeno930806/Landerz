(function () {
  "use strict";
  window.addEventListener("load", () => {
    app();
  });
})();

async function app() {
  // Parámetros //
  const usersUrl = "https://jsonplaceholder.typicode.com/users";
  const postsUrl = "https://jsonplaceholder.typicode.com/posts";
  let data = [];
  let users = [];
  let posts = [];
  let currentPost = 1;
  let glide = new Glide(".glide");

  try {
    data = await Promise.all([getData(usersUrl), getData(postsUrl)]);
  } catch (error) {
    console.log(error);
  }

  if (data[0] && data[1]) {
    users = data[0];
    posts = data[1];
    currentPost = 1;

    renderData(users, posts);

    glide.mount();

    let navControls = document.querySelectorAll(".glide__bullet");
    navControls.forEach((item) => {
      item.onclick = (event) => {
        let activeIndex = getElementIndex(event.target);
        updateControls(activeIndex, true);
      };
    });

    let sideControls = document.querySelectorAll(".side-control");
    sideControls.forEach((item) => {
      item.onclick = (item) => {
        let activeIndex = 0;
        updateControls(activeIndex);
      };
    });
  }

  function updateControls(activeIndex, transition = false) {
    let currentUser = glide.index;
    let userPosts = posts.filter(
      (item) => item.userId === users[currentUser].id
    );
    const postElement = document.querySelector(
      `#tstml${users[currentUser].id}`
    );

    if (transition) {
      postElement.classList.toggle("fade-out");
      setTimeout(function () {
        postElement.innerHTML = userPosts[activeIndex].body;
        postElement.classList.toggle("fade-out");
      }, 500);
    } else {
      postElement.innerHTML = userPosts[activeIndex].body;
    }

    let el = document.querySelector(".glide_active");
    el.classList.toggle("glide_active");

    document
      .querySelectorAll(".glide__bullet")
      [activeIndex].classList.toggle("glide_active");
  }

  async function getData(url) {
    return fetch(url)
      .then((jsonData) => jsonData.json())
      .then((data) => data);
  }

  function renderData(users, posts) {
    users.forEach((user, index) => {
      let userPosts = posts.filter((item) => item.userId === user.id);
      let glideUserList = document.querySelector("#glide-user-list");
      glideUserList.innerHTML += renderGlideSlide(user, userPosts[0]);

      let carControls = document.querySelector("#car-controls");
      carControls.innerHTML += renderGlideControl(index + 1);
    });
  }

  function renderGlideSlide(user, post) {
    const { id: userId, name: userName } = user;
    const { id: postId, body: postContent } = post;

    return `<li class="glide__slide">
          <div
            class="col-8 col-md-6 mx-auto d-flex flex-column align-items-center"
          >
            <img
            class="tstml-img"
              src="assets/img/person_${userId}.jpg"
              alt="person_${userId}.jpg"
            />
            <p class="fade-transition text-center mt-3" id="tstml${userId}">
              ${postContent}
            </p>
            <h6 class="font-weight-bold">${userName}</h6>
          </div>
        </li>`;
  }

  function renderGlideControl(index) {
    let text = index === 1 ? "glide_active" : "";
    return `<button
      class="glide__bullet ${text}"
      data-glide-dir="=${index}"
    ></button>`;
  }

  function getElementIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element);
  }
}
