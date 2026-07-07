'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const card = { border: '1px solid #e8e8e8', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }
const label = { fontSize: 12, fontWeight: 600, color: '#999', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 4 }
const input = { width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #e5e5e5', borderRadius: 8, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }
const btn = { background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
const btnGhost = { ...btn, background: '#fff', color: '#555', border: '1px solid #e5e5e5' }
const rowTitle = { fontSize: 15, fontWeight: 700, letterSpacing: '-.2px', color: '#111', marginBottom: 2 }
const rowSub = { fontSize: 12.5, color: '#999', marginBottom: 14 }

function Note({ msg }) {
  if (!msg) return null
  const ok = msg.type === 'ok'
  return (
    <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 500, color: ok ? '#16a34a' : '#dc2626' }}>{msg.text}</div>
  )
}

export default function Settings() {
  const { user, isLoaded } = useUser()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nameMsg, setNameMsg] = useState(null)
  const [savingName, setSavingName] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [emailObj, setEmailObj] = useState(null)
  const [code, setCode] = useState('')
  const [emailMsg, setEmailMsg] = useState(null)
  const [emailBusy, setEmailBusy] = useState(false)

  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwBusy, setPwBusy] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
    }
  }, [isLoaded, user])

  async function saveName() {
    setSavingName(true); setNameMsg(null)
    try {
      await user.update({ firstName, lastName })
      setNameMsg({ type: 'ok', text: 'Name updated.' })
    } catch (e) {
      setNameMsg({ type: 'err', text: e.errors?.[0]?.message || 'Could not update name.' })
    }
    setSavingName(false)
  }

  async function startEmail() {
    setEmailBusy(true); setEmailMsg(null)
    try {
      const obj = await user.createEmailAddress({ email: newEmail })
      await obj.prepareVerification({ strategy: 'email_code' })
      setEmailObj(obj)
      setEmailMsg({ type: 'ok', text: `Verification code sent to ${newEmail}.` })
    } catch (e) {
      setEmailMsg({ type: 'err', text: e.errors?.[0]?.message || 'Could not send code.' })
    }
    setEmailBusy(false)
  }

  async function confirmEmail() {
    setEmailBusy(true); setEmailMsg(null)
    try {
      const verified = await emailObj.attemptVerification({ code })
      await user.update({ primaryEmailAddressId: verified.id })
      await user.reload()
      setEmailObj(null); setNewEmail(''); setCode('')
      setEmailMsg({ type: 'ok', text: 'Email updated.' })
    } catch (e) {
      setEmailMsg({ type: 'err', text: e.errors?.[0]?.message || 'Invalid code.' })
    }
    setEmailBusy(false)
  }

  async function savePw() {
    setPwBusy(true); setPwMsg(null)
    try {
      await user.updatePassword({ currentPassword: curPw, newPassword: newPw })
      setCurPw(''); setNewPw('')
      setPwMsg({ type: 'ok', text: 'Password updated.' })
    } catch (e) {
      setPwMsg({ type: 'err', text: e.errors?.[0]?.message || 'Could not update password.' })
    }
    setPwBusy(false)
  }

  const currentEmail = user?.primaryEmailAddress?.emailAddress || '—'
  const hasPassword = user?.passwordEnabled

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 860, padding: '36px 24px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: '#111' }}>Settings</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Manage your account details and sign-in credentials</div>
        </div>

        {!isLoaded && <div style={{ fontSize: 13, color: '#aaa' }}>Loading…</div>}

        {isLoaded && (
          <>
            {/* Name */}
            <div style={card}>
              <div style={rowTitle}>Name</div>
              <div style={rowSub}>Shown across your Kira account.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={label}>First name</div>
                  <input style={input} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Pieter" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={label}>Last name</div>
                  <input style={input} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="" />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <button style={{ ...btn, opacity: savingName ? 0.6 : 1 }} onClick={saveName} disabled={savingName}>
                  {savingName ? 'Saving…' : 'Save name'}
                </button>
              </div>
              <Note msg={nameMsg} />
            </div>

            {/* Email */}
            <div style={card}>
              <div style={rowTitle}>Email</div>
              <div style={rowSub}>Current: <span style={{ color: '#111', fontWeight: 500 }}>{currentEmail}</span></div>
              {!emailObj ? (
                <>
                  <div style={label}>New email</div>
                  <input style={input} type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="you@company.com" />
                  <div style={{ marginTop: 14 }}>
                    <button style={{ ...btn, opacity: emailBusy || !newEmail ? 0.6 : 1 }} onClick={startEmail} disabled={emailBusy || !newEmail}>
                      {emailBusy ? 'Sending…' : 'Send verification code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={label}>Enter the 6-digit code</div>
                  <input style={input} value={code} onChange={e => setCode(e.target.value)} placeholder="123456" />
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button style={{ ...btn, opacity: emailBusy || !code ? 0.6 : 1 }} onClick={confirmEmail} disabled={emailBusy || !code}>
                      {emailBusy ? 'Verifying…' : 'Confirm email'}
                    </button>
                    <button style={btnGhost} onClick={() => { setEmailObj(null); setCode(''); setEmailMsg(null) }}>Cancel</button>
                  </div>
                </>
              )}
              <Note msg={emailMsg} />
            </div>

            {/* Password */}
            <div style={card}>
              <div style={rowTitle}>Password</div>
              <div style={rowSub}>{hasPassword ? 'Change your sign-in password.' : 'Your account signs in without a password.'}</div>
              {hasPassword && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={label}>Current password</div>
                    <input style={input} type="password" value={curPw} onChange={e => setCurPw(e.target.value)} />
                  </div>
                  <div>
                    <div style={label}>New password</div>
                    <input style={input} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <button style={{ ...btn, opacity: pwBusy || !curPw || !newPw ? 0.6 : 1 }} onClick={savePw} disabled={pwBusy || !curPw || !newPw}>
                      {pwBusy ? 'Saving…' : 'Update password'}
                    </button>
                  </div>
                  <Note msg={pwMsg} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
