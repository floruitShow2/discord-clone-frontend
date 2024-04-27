function changeTheme(theme: Global.Settings['theme']) {
  if (theme === 'dark') {
    document.body.setAttribute('arco-theme', 'dark')
  } else {
    document.body.removeAttribute('arco-theme')
  }
}

export { changeTheme }
