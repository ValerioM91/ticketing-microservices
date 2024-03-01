import Link from 'next/link'

const Header = ({ currentUser }: { currentUser?: User }) => {
  console.log('currentUser', currentUser)
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]

  return (
    <nav className="bg-white flex items-center gap-4">
      <Link href="/" className="text-blue-500">
        Home
      </Link>

      <ul>
        {links.filter(Boolean).map((link) => {
          const { label, href } = link || {}

          if (!label || !href) return null

          return (
            <li key={href} className="nav-item">
              <Link className="nav-link" href={href}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export default Header
