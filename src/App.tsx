import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { StartPage } from './pages/StartPage'
import { ProgressPage } from './pages/ProgressPage'
import { TodayPage } from './pages/TodayPage'
import { CoachPage } from './pages/CoachPage'
import { PlatePage } from './pages/PlatePage'
import { NumbersPage } from './pages/NumbersPage'
import { SafetyPage } from './pages/SafetyPage'
import { DailyPage } from './pages/DailyPage'
import { OverviewPage } from './pages/OverviewPage'
import { RulesPage } from './pages/RulesPage'
import { TroubleshootPage } from './pages/TroubleshootPage'
import { SupplementsPage } from './pages/SupplementsPage'
import { EatingOutPage } from './pages/EatingOutPage'
import { ShoppingPage } from './pages/ShoppingPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { FoodsPage } from './pages/FoodsPage'
import { BiomarkersPage } from './pages/BiomarkersPage'
import { SynergiesPage } from './pages/SynergiesPage'
import { SupportPage } from './pages/SupportPage'
import { ReviewPage } from './pages/ReviewPage'
import { PhasesPage } from './pages/PhasesPage'
import { MealsPage } from './pages/MealsPage'
import { FoodSwapsPage } from './pages/FoodSwapsPage'

export default function App() {
  return (
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
  )
}
