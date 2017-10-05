export default function ({ store, redirect, error }) {
  if (store.state.user.isLoggedIn) {
    return redirect('/')
  }
}
