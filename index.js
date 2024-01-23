let app = new Vue({
  el: "#app",
  data: {
    welcome: "hello world",
    lessons:[],
    apiServer:remoteServer,
    showSubject: true,
    sortType: "topic",
    mode: "ascending",
    query: "",
    searchText: "",
    searchResults:[],
    cart: [],
    navigator: {
      lessonPage: 0,
      cartPage: 1,
    },
    currentPage: 0,
    order: {
      name: "",
      phone: "",
      errorMessage: "sss",
    },
  },

  // make api requests before application mounts
  mounted () {

  getLessons().then((data)=>{
this.lessons = data
    })
  
  },
  
  watch: {
    searchText: function (newSearchText, oldSearchText) {
      if (newSearchText.length > 0) {
        this.searchLessons();
      } else {
        this.searchResults = [];
      }
    },
  },
  methods: {
    async searchLessons() {
      if (this.searchText.length > 0) {
        try {
          // Use await to wait for the searchLessons promise to resolve
          const data = await searchLessons(this.searchText);
          this.searchResults = data;
        } catch (error) {
          console.error('Error fetching data:', error);
          this.searchResults = []; // Handle errors as needed
        }
      } else {
        // If search text is empty, reset the searchResults
        this.searchResults = [];
      }
    },
  
    addToCart: function (lesson) {
      let lessonInCart = this.cart.find((item) => item._id === lesson._id);
      const increaseAmount = 1;
      // check if lesson is already in cart
      if (lessonInCart) {
        lessonInCart.spaces += 1;
      } else {
        this.cart = [...this.cart, { ...lesson, spaces: 1 }];
      }
      lesson.spaces--;
    },

    // review this code
    togglePage: function () {
      this.currentPage = this.currentPage === 0 ? 1 : 0;
    },
    removeLesson: function (lesson) {
      let lessonInLessons = this.lessons.find((item) => item._id === lesson._id);
      // remove the item if spaces less than zero
      if (lesson.spaces <= 1) {
        this.cart = this.cart.filter((item) => item._id !== lesson._id);
      } else {
        lesson.spaces -= 1;
      }
      lessonInLessons.spaces += 1;
    },
    completeCheckout: async function () {
      const order = await createNewOrder(
        {
          name: this.order.name,
          phoneNumber: this.order.phone,
          lessonIds: this.cart,
          spaces:this.cart.reduce((track, currentElement) => {
            return track + currentElement.spaces;
          }, 0)
        }

      )
      if(order){
       alert (`Order with the ID ${order.newOrder.insertedId} was ${order.message}`)
        updateLessons(order.newOrder.insertedId).then((data)=>{
          alert(data.message)
        })
      }
    },
  },
  computed: {
    sortedLessons:  function () {
      let order = this.mode === "ascending" ? 1 : -1;
      return this.lessons?.slice()
        .sort((a, b) => {
          if (
            typeof a[this.sortType] === "string" &&
            typeof b[this.sortType] === "string"
          ) {
            return order * a[this.sortType].localeCompare(b[this.sortType]);
          } else {
            return order * (a[this.sortType] - b[this.sortType]);
          }
        });
    },
    isCheckoutDisabled: function () {
      let isValidName =
        this.order.name.trim().length > 0 &&
        /^[A-Za-z\s]*$/.test(this.order.name);
      let isVaidNumber =
        this.order.phone.trim().length > 0 && /^[0-9]*$/.test(this.order.phone);

      let isButtonDisabled = !(isVaidNumber && isValidName) ;
      // force set Disabled if cart is empty
      if(this.cart.length === 0) {
        isButtonDisabled = true;
        this.order.errorMessage = "cart is empty";
        return isButtonDisabled;
      }
      this.order.errorMessage = "please enter a valid name and phone number";
      return isButtonDisabled;
    },
    

  },
});
