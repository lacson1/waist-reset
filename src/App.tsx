import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'

const StartPage = lazy(() => import('./pages/StartPage').then((m) => ({ default: m.StartPage })))
const ProgressPage = lazy(() =>
  import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })),
)
const TodayPage = lazy(() => import('./pages/TodayPage').then((m) => ({ default: m.TodayPage })))
const CoachPage = lazy(() => import('./pages/CoachPage').then((m) => ({ default: m.CoachPage })))
const PlatePage = lazy(() => import('./pages/PlatePage').then((m) => ({ default: m.PlatePage })))
const NumbersPage = lazy(() =>
  import('./pages/NumbersPage').then((m) => ({ default: m.NumbersPage })),
)
const SafetyPage = lazy(() => import('./pages/SafetyPage').then((m) => ({ default: m.SafetyPage })))
const DailyPage = lazy(() => import('./pages/DailyPage').then((m) => ({ default: m.DailyPage })))
const OverviewPage = lazy(() =>
  import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage })),
)
const RulesPage = lazy(() => import('./pages/RulesPage').then((m) => ({ default: m.RulesPage })))
const TroubleshootPage = lazy(() =>
  import('./pages/TroubleshootPage').then((m) => ({ default: m.TroubleshootPage })),
)
const SupplementsPage = lazy(() =>
  import('./pages/SupplementsPage').then((m) => ({ default: m.SupplementsPage })),
)
const EatingOutPage = lazy(() =>
  import('./pages/EatingOutPage').then((m) => ({ default: m.EatingOutPage })),
)
const ShoppingPage = lazy(() =>
  import('./pages/ShoppingPage').then((m) => ({ default: m.ShoppingPage })),
)
const ResourcesPage = lazy(() =>
  import('./pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })),
)
const FoodsPage = lazy(() => import('./pages/FoodsPage').then((m) => ({ default: m.FoodsPage })))
const BiomarkersPage = lazy(() =>
  import('./pages/BiomarkersPage').then((m) => ({ default: m.BiomarkersPage })),
)
const SynergiesPage = lazy(() =>
  import('./pages/SynergiesPage').then((m) => ({ default: m.SynergiesPage })),
)
const SupportPage = lazy(() =>
  import('./pages/SupportPage').then((m) => ({ default: m.SupportPage })),
)
const ReviewPage = lazy(() => import('./pages/ReviewPage').then((m) => ({ default: m.ReviewPage })))
const PhasesPage = lazy(() => import('./pages/PhasesPage').then((m) => ({ default: m.PhasesPage })))
const MealsPage = lazy(() => import('./pages/MealsPage').then((m) => ({ default: m.MealsPage })))
const FoodSwapsPage = lazy(() =>
  import('./pages/FoodSwapsPage').then((m) => ({ default: m.FoodSwapsPage })),
)

export default function App() {
  return (
    <Suspense fallback={<div className="app-loading muted">Loading page…</div>}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/start" replace />} />
          <Route path="start" element={<StartPage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="coach" element={<CoachPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="plate" element={<PlatePage />} />
          <Route path="swaps" element={<FoodSwapsPage />} />
          <Route path="daily" element={<DailyPage />} />
          <Route path="meals" element={<MealsPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="numbers" element={<NumbersPage />} />
          <Route path="phases" element={<PhasesPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="troubleshoot" element={<TroubleshootPage />} />
          <Route path="supplements" element={<SupplementsPage />} />
          <Route path="eatingout" element={<EatingOutPage />} />
          <Route path="shopping" element={<ShoppingPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="foods" element={<FoodsPage />} />
          <Route path="biomarkers" element={<BiomarkersPage />} />
          <Route path="synergies" element={<SynergiesPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
