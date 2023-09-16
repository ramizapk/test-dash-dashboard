import { createContext, useContext } from "react"

export const StoreContext = createContext()
export const useAuth = () => {
  const { user, loading, initialAuthCheck } = useContext(StoreContext)

  const isLoggedIn = user !== null

  return {
    user,
    loading,
    isLoggedIn,
    initialAuthCheck,
  }
}

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [initialAuthCheck, setInitialAuthCheck] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
      setIsLoggedIn(user !== null)
      setInitialAuthCheck(true)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    initialAuthCheck,
  }

  return (
    <StoreContext.Provider value={value} isLoggedIn={isLoggedIn}>
      {children}
    </StoreContext.Provider>
  )
}
