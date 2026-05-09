import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/** Catches lazy-chunk load failures (e.g., after redeploys invalidate old hashes). */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error): void {
    if (typeof console !== 'undefined') console.error('Route render failed', error)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children
    const isChunkError = /chunk|dynamically imported module|Failed to fetch/i.test(
      this.state.error.message,
    )
    return (
      <div className="app-loading" role="alert">
        <p>
          {isChunkError
            ? 'A new version of this page is available.'
            : 'Something went wrong loading this page.'}
        </p>
        <button type="button" className="btn" onClick={this.handleReload}>
          Reload
        </button>
      </div>
    )
  }
}
