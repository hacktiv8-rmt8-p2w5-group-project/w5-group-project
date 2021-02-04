$(document).ready(() => {
  auth()
  $("#linkRegister").on("click", e => {
    e.preventDefault()
    showRegister()
  })
  $("#linkLogin").on("click", e => {
    e.preventDefault()
    auth()
  })
  $("#loginform").on("submit", e => {
    e.preventDefault()
    login()
  })
  $("#registerform").on("submit", e => {
    e.preventDefault()
    register()
    auth()
  })
  $("#logout").on("click", e => {
    e.preventDefault()
    localStorage.removeItem("access_token")
    auth()
  })
  $("#cat_btn").click((e) => {
    e.preventDefault()
    getRandomCatPicture()
    getRandomCatFacts()
  })
})

const base_url = "http://localhost:3000/"

function auth() {
  if (!localStorage.getItem("access_token")) {
    $("#loginform").show()
    $("#registerform").hide()
    $("#mainpage").hide()
    $("#navbar").hide()
  } else {
    $("#loginform").hide()
    $("#registerform").hide()
    $("#mainpage").show()
    $("#navbar").show()
  }
}

function showRegister() {
  $("#loginform").hide()
  $("#registerform").show()
  $("#mainpage").hide()
  $("#navbar").hide()
}

function login() {
  const email = $("#loginemail").val()
  const password = $("#loginpassword").val()
  $.ajax({
    url: base_url + "login",
    method: "POST",
    data: {
      email,
      password
    }
  })
    .done(res => {
      localStorage.setItem("access_token", res.access_token)
      auth()
    })
    .fail((xhr, txt) => {
      console.log(xhr, txt)
    })
    .always(_ => {
      console.log("always")
      $("#loginform").trigger("reset")
    })
}

function register() {
  const email = $("#registeremail").val()
  const password = $("#registerpassword").val()
  console.log(email, password);
  $.ajax({
    url: base_url + "register",
    method: "POST",
    data: {
      email,
      password
    }
  })
    .done(res => {
      console.log(res);
      auth()
    })
    .fail((xhr, txt) => {
      console.log(xhr, txt);
      auth()
    })
    .always(_ => {
      $("#registerform").trigger("reset")
    })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token
  $.ajax({
    url: base_url + `googleLogin`,
    method: "POST",
    data: {
      google_token: id_token,
    },
  })
    .done((res) => {
      auth()
    })
    .fail((xhr, txt) => {
      console.log(xhr, txt);
    })
}

function getRandomCatPicture() {
  $.ajax({
    url: base_url + `cat-pictures`,
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token")
    }
  })
    .done(res => {
      $("#cat_result").html(`<img src=${res[0].url} alt="cat" />`)
    })
    .fail((xhr, txt) => {
      console.log(xhr, txt);
    })
}

// const cat_result = document.getElementById("cat_result")
// async function getRandomCatPicture() {
//   try {
//     const response = await axios({
//       url: base_url + `cat-pictures`,
//       method: "get",
//       headers: {
//         access_token: localStorage.getItem("access_token")
//       }
//     })
//     cat_result.innerHTML = `<img src=${response.data[0].url} alt="cat" />`
//   } catch (err) {
//     throw err.message
//   }
// }

const cat_fact = document.getElementById("cat_fact")
async function getRandomCatFacts() {
  try {
    const response = await axios({
      url: base_url + `cat-facts`,
      method: "get",
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    cat_fact.innerHTML = `<h3>${response.data}</h3>`
  } catch (err) {
    throw err.message
  }
}