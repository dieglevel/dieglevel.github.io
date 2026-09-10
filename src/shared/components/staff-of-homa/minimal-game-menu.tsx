import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { AppMenu } from '@/shared/common/menu'

export function MinimalGameMenu() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ finance: true })

  const toggleGroup = (id: string) => {
    setOpenGroups((previous) => ({ ...previous, [id]: !previous[id] }))
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: '80px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        userSelect: 'none',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {AppMenu.map((group) => {
          const isOpen = !!openGroups[group.id]
          const hasChildren = group.children && group.children.length > 0

          return (
            <div key={group.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => hasChildren && toggleGroup(group.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  cursor: hasChildren ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '18px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  transition: 'all 0.2s ease',
                  textShadow: isOpen ? '0 0 12px rgba(255, 255, 255, 0.4)' : 'none',
                }}
              >
                {group.icon}
                <span>{group.label}</span>
                {hasChildren && (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                )}
              </button>

              {hasChildren && isOpen && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '12px',
                    paddingLeft: '20px',
                  }}
                >
                  {group.children!.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link || '/'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'rgba(255, 255, 255, 0.65)',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        transition: 'all 0.2s ease',
                      }}
                      activeProps={{
                        style: {
                          color: '#ff4b2b',
                          fontWeight: 700,
                          textShadow: '0 0 10px rgba(255, 75, 43, 0.6)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}