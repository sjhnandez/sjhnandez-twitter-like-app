users = User.create([
  {
    name: "Sebastián Hernández",
    screen_name: "hnandez_s",
    location: "Barranquilla",
    url: "tareas2go.com",
    description: "Esto es una prueba",
    followers_count: 5,
    friends_count: 20,
  },
])

users = User.create([
  {
    name: "Fabio Zapata",
    screen_name: "fazd",
    location: "Barranquilla",
    url: "tareas2go.com",
    description: "Esto es una prueba",
    followers_count: 5,
    friends_count: 20,
  },
])

users = User.create([
  {
    name: "fabio 2",
    screen_name: "Fazd2",
    location: "Barranquilla",
    url: "tareas2go.com",
    description: "Esto es una prueba",
    followers_count: 5,
    friends_count: 20,
  },
])

users = User.create([
  {
    name: "Fazd 3",
    screen_name: "Fazd_3",
    location: "Barranquilla",
    url: "tareas2go.com",
    description: "Esto es una prueba",
    followers_count: 5,
    friends_count: 20,
  },
])


tweets = Tweet.create([
  {
    text: "Seed tweet!",
    user: User.first,
    is_retweet: false,
    hasImage: false,
    image_url: "",
    tweet_ret_id: "",
  },
])
