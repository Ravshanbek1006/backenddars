const API_BASE = "https://jsonplaceholder.typicode.com";

function fetchJson(url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  });
}

function runCallbackHell(next) {
  setTimeout(() => {
    console.log("Loading users...");
    setTimeout(() => {
      console.log("Loading posts...");
      setTimeout(() => {
        console.log("Done!");
        if (typeof next === "function") {
          next();
        }
      }, 1000);
    }, 1000);
  }, 1000);
}

function runPromiseChain() {
  fetchJson(`${API_BASE}/users`)
    .then((users) => {
      if (!Array.isArray(users) || users.length === 0) {
        throw new Error("Users list is empty");
      }
      const firstUserId = users[0].id;
      return fetchJson(`${API_BASE}/posts?userId=${firstUserId}`);
    })
    .then((posts) => {
      const titles = posts.slice(0, 5).map((post) => post.title);
      console.log("First 5 post titles:");
      titles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`);
      });
    })
    .catch((error) => {
      console.error("Promise chain error:", error.message);
    });
}

function runPromiseAll() {
  Promise.all([
    fetchJson(`${API_BASE}/users`),
    fetchJson(`${API_BASE}/posts`),
    fetchJson(`${API_BASE}/comments`)
  ])
    .then(([users, posts, comments]) => {
      console.log(`Users: ${users.length}`);
      console.log(`Posts: ${posts.length}`);
      console.log(`Comments: ${comments.length}`);
    })
    .catch((error) => {
      console.error("Promise.all error:", error.message);
    });
}

runCallbackHell(() => {
  runPromiseChain();
  runPromiseAll();
});
