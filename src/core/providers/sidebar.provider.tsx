import { createContext, type JSX, type PropsWithChildren, useContext, useState } from "react"

interface Props {
  isSidebarOpen: boolean
  onToggleSidebar: (value: boolean) => void
}

const SidebarContext = createContext<Props>({
  isSidebarOpen: true,
  onToggleSidebar: () => { }
})

export const useSidebar = (): Props => useContext(SidebarContext)

export const SidebarProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const onToggleSidebar = (value: boolean): void => setIsSidebarOpen(value)

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, onToggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}