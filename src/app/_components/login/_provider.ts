// Login uchun

// useEffect(() => {
//   const loginTime = sessionStorage.getItem("loginTime");
//   const currentTime = new Date().getTime();
//   const oneHour = 60 * 60 * 1000;

//   const checkSession = () => {
//     if (loginTime) {
//       if (currentTime - parseInt(loginTime) > oneHour) {
//         console.log("hi");
//         router.push("/");
//         sessionStorage.removeItem("loginTime");
//         sessionStorage.removeItem("isLoggedIn");
//       }
//     } else {
//       router.push("/");
//       sessionStorage.removeItem("loginTime");
//       sessionStorage.removeItem("isLoggedIn");
//     }
//   };
//   const interval = setInterval(checkSession, oneHour);
//   return () => clearInterval(interval);
// }, [router]);
