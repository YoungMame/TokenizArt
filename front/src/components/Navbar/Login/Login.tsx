function Login() {
  const loginWithMetamask = () => {
    alert('Login with Metamask clicked')
  }

  return (
    <>
        <button onClick={loginWithMetamask}>
            Login with Metamask
        </button>

    </>
  )
}

export default Login