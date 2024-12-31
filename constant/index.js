// export const baseURL = "https://books.foreverbooks.co.in/laravel_api/";
export const baseURL = "https://foreverbooks.co.in/rsdigitextapp/api/"; //http://192.168.2.77:8081/api/
export const token = '123456';
export const tokenMobileOTP = "books002"
export const domain_url = 'https://www.rachnasagar.in/';
export const data_url = 'https://www.rachnasagar.in/data/';

// for paytm payment gatway by Raju dt 27/06/2024
export const MID = "SobFbq23928001131696"; //paytm
export const API_Key = "rzp_live_ESHYjQ2LWl9DNS"; //razorpay
export const API_URL = "http://localhost:8080/token.php";
export const CALLBACK_URL = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
export const URL_SCHEME = "paytmMIDSobFbq23928001131696";


export const apiRoutes = Object.freeze({
    mobileOTP: "send_otp",
    //bannerList: "banner",
    getBanners: "getBanners",
    newRelease: "new_releases",
    newReleasesAllBooks: "new_releases_all_books",
    boardTypes: "mst_category",
    classes: "classes",
    bookType: "bookTypeId",
    subjects: "subjects",
    defaultTitleCBSE: "default_title_show",
    searchFilter: "search",
    singleProductList: "internal_books_details",
    productReviews: "product_review",
    searchFilterForNewReleaseAllBooks: "new_releases_all_books",
    indianState: "state",
    indianCity: "cities",
    createAccount: "create_account",
    countryList: "country",
    registrationAcc: "registration",
    loginAccount: "login",
    forgotPassword: "forget_password",
    newPasswordGenerator: "enter_password",
    getUserAddress: "show_all_address",
    filterTitlesOfBoardClassBooksSubject: "result_all",
    eBookList: "eBookOrderlist",
    interactiveBookList: "interactive_ebooks",
    addToCartList: "add_to_cart",
    viewAllCartList: "view_all_cart",
    removeCardItem: "remove_to_cart",
    grandTotalOfCart: "calculate_cart_ammount",
    productQuantityDecrement: "single_remove_to_cart",
    userAddAddress: "add_user_address",
    userDeleteAddress: "delete_user_address",
    userEditAddressSave: "editAddress",
    generateOrderPaytm: "generateOrder",
    razorPayOrderGenerator: "razorPayOrder",
    paymentStatus: "paymentStatus",
    addToWishlist: "add_to_wishlist",
    deleteToWishlist: "remove_from_wishlist",
    viewWishlistProduct: "view_wishlist",
    removeAllFromWishlist: "removeAllWishlist",
    checkItemInWishlist: "checkItemInWishlist",
    verifyOrder: "verifyOrder",
    orderlist: "orderlist",
    order_invoice_api: "order_invoice_api",
    validateCoupon: "validateCoupon",
    closeAccountPermanently: "delete_user",
    updateCartQuantity: "updateCartQuantity",
    updateUserProfile: "updateUserProfile",
    getUserProfile: "getUserProfile",
    updateUserDetails: "updateUserDetails",
    allBookList: "allBookList",
    bookSellerList: "bookSellerList"
})


export const rsplTheme = {
    rsplWhite: "#ffffff",
    rsplBlue: "#0b66c3",
    // rsplBackgroundColor:"#00B9F1", //like payTM color
    // rsplBackgroundColor:"#0072c6",
    rsplBackgroundColor: "#0f62ac", //for v-2 school
    rsplLoader: "#45b6fe",
    rsplGreen: "#4BB543",
    rsplTextColor: "#002E6E",
    rsplBorderGrey: "#C5C5C5",
    tblHead: "#6FB6FF",
    tblSubHead: "#BBDDFF",
    tblBorder: "#3D9DFF",
    rsplRed: "#f00",
    rsplLightGrey: "#f1f3f4",
    rsplBlack: "#000",
    jetGrey: "#616D7E",
    orange: "#FFA500",
    rsplBgColor: "#f26b4e",
    rsplLightPink: "#ffa19e",
    textColorLight: "#737f8b",
    textColorBold: "#334054",
    gradientColorLeft: "#fa6039",
    gradientColorRight: "#ec1c24",
    ratingStarColor: "#ffa534",
    lightYellow: "#fffbeb",

    //some cool colors palette
    OFFWhite: "#FAF9F6",
    AliceBlue: "#F0F8FF",
    Pearl: "#FBFCF8",
    EggShell: "#FFF9E3",
    Coconut: "#FFF1E6",
    Parchment: "#FBF5DF",



};

export const nonVisibleBottomTab = [
    "",
    "",

]
