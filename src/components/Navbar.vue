<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <router-link class="navbar-brand" :to="{ name: 'home' }">
      TheProject
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <!-- <li class="nav-item active">
          <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Disabled</a>
        </li> -->
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'register' }">
            Signup
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'login' }">
            Login
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
