let app = new Vue({
  el: "#app",
  data: {
    welcome: "hello world",
    lessons,
    showSubject: true,
    sortType: "subject",
    mode: "ascending",
    query: "",
    searchText: "",
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

  methods: {
    addToCart: function (lesson) {
      let lessonInCart = this.cart.find((item) => item.id === lesson.id);
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
      let lessonInLessons = this.lessons.find((item) => item.id === lesson.id);
      // remove the item if spaces less than zero
      if (lesson.spaces <= 1) {
        this.cart = this.cart.filter((item) => item.id !== lesson.id);
      } else {
        lesson.spaces -= 1;
      }
      lessonInLessons.spaces += 1;
    },
    completeCheckout: function () {
      alert(`${this.order.name} your  order has been submitted`);
    },
  },
  computed: {
    sortedLessons: function () {
      let order = this.mode === "ascending" ? 1 : -1;
      return this.lessons
        .slice()
        .filter((item) => {
          return (
            item.subject
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            item.location.toLowerCase().includes(this.searchText.toLowerCase())
          );
        })
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

      let isButtonDisabled = !(isVaidNumber && isValidName);
      this.order.errorMessage = "please enter a valid name and phone number";
      return isButtonDisabled;
    },
  },
});
