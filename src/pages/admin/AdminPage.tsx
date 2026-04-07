import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import { useAuth } from '../../features/auth/useAuth';
import { useAdminDashboard } from '../../features/admin/queries';
import type {
  AdminCommentSummary,
  AdminFavoriteSummary,
  AdminTrendSnapshot,
  AdminUserSummary,
} from '../../features/admin/types';
import useLogoutOnUnauthorized from '../home/hooks/useLogoutOnUnauthorized';
import { ApiRequestError, isApiConfigured } from '../../lib/api';
import './AdminPage.css';

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatNumber(value: number | null | undefined) {
  if (typeof value !== 'number') {
    return '-';
  }

  return new Intl.NumberFormat('ko-KR').format(value);
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="admin-page__metric-card">
      <p className="admin-page__metric-label">{label}</p>
      <strong className="admin-page__metric-value">{formatNumber(value)}</strong>
    </article>
  );
}

function RecentUsersTable({ items }: { items: AdminUserSummary[] }) {
  return (
    <div className="admin-page__table-wrap">
      <table className="admin-page__table">
        <thead>
          <tr>
            <th>사용자</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>마지막 로그인</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.displayName}</td>
              <td>{item.email}</td>
              <td>{formatDateTime(item.createdAt)}</td>
              <td>{formatDateTime(item.lastLoginAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentCommentsTable({ items }: { items: AdminCommentSummary[] }) {
  return (
    <div className="admin-page__table-wrap">
      <table className="admin-page__table">
        <thead>
          <tr>
            <th>작성자</th>
            <th>댓글</th>
            <th>비디오</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.author}</td>
              <td className="admin-page__content-cell">{item.content}</td>
              <td>{item.videoId}</td>
              <td>{formatDateTime(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentFavoritesTable({ items }: { items: AdminFavoriteSummary[] }) {
  return (
    <div className="admin-page__table-wrap">
      <table className="admin-page__table">
        <thead>
          <tr>
            <th>채널</th>
            <th>사용자</th>
            <th>채널 ID</th>
            <th>추가일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.channelTitle}</td>
              <td>{item.userEmail}</td>
              <td>{item.channelId}</td>
              <td>{formatDateTime(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendList({ items }: { items: AdminTrendSnapshot[] }) {
  return (
    <div className="admin-page__trend-list">
      {items.map((item) => (
        <article className="admin-page__trend-card" key={item.videoId}>
          <img alt="" className="admin-page__trend-thumbnail" src={item.thumbnailUrl} />
          <div className="admin-page__trend-body">
            <p className="admin-page__trend-rank">#{item.rank}</p>
            <strong className="admin-page__trend-title">{item.title}</strong>
            <p className="admin-page__trend-channel">{item.channelTitle}</p>
            <p className="admin-page__trend-meta">조회수 {formatNumber(item.viewCount)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { accessToken, isLoggingOut, logout, status, user } = useAuth();
  const dashboardQuery = useAdminDashboard(accessToken, status === 'authenticated');

  useLogoutOnUnauthorized(dashboardQuery.error, logout);

  const errorMessage =
    dashboardQuery.error instanceof ApiRequestError
      ? dashboardQuery.error.message
      : '관리자 정보를 불러오지 못했습니다.';
  const isForbidden =
    dashboardQuery.error instanceof ApiRequestError && dashboardQuery.error.status === 403;

  if (!isApiConfigured) {
    return (
      <main className="admin-page">
        <section className="admin-page__hero admin-page__hero--centered">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">백엔드 연결이 필요합니다</h1>
          <p className="admin-page__description">`VITE_API_BASE_URL` 설정 후 관리자 대시보드를 사용할 수 있습니다.</p>
        </section>
      </main>
    );
  }

  if (status === 'loading') {
    return (
      <main className="admin-page">
        <section className="admin-page__hero admin-page__hero--centered">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">세션을 확인하는 중입니다</h1>
        </section>
      </main>
    );
  }

  if (status !== 'authenticated') {
    return (
      <main className="admin-page">
        <section className="admin-page__hero admin-page__hero--centered">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">관리자 로그인이 필요합니다</h1>
          <p className="admin-page__description">
            기존 구글 로그인 세션을 그대로 사용합니다. 로그인 후 허용된 관리자 이메일이면 대시보드가 열립니다.
          </p>
          <div className="admin-page__login-panel">
            <GoogleLoginButton />
          </div>
          <a className="admin-page__link" href="/">
            홈으로 이동
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-page__hero">
        <div>
          <p className="admin-page__eyebrow">Operations Console</p>
          <h1 className="admin-page__title">YouTube Atlas Admin</h1>
          <p className="admin-page__description">
            최근 사용자 활동과 댓글, 즐겨찾기, 트렌딩 수집 상태를 한 화면에서 확인할 수 있습니다.
          </p>
        </div>
        <div className="admin-page__hero-actions">
          <div className="admin-page__user-chip">
            <span className="admin-page__user-label">Signed in as</span>
            <strong>{user?.email}</strong>
          </div>
          <a className="admin-page__button admin-page__button--ghost" href="/">
            홈으로
          </a>
          <button
            className="admin-page__button"
            disabled={isLoggingOut}
            onClick={() => {
              void logout();
            }}
            type="button"
          >
            로그아웃
          </button>
        </div>
      </section>

      {dashboardQuery.isLoading ? (
        <section className="admin-page__panel">
          <h2 className="admin-page__section-title">대시보드 로딩 중</h2>
        </section>
      ) : null}

      {dashboardQuery.isError ? (
        <section className="admin-page__panel">
          <h2 className="admin-page__section-title">{isForbidden ? '접근 권한 없음' : '불러오기 실패'}</h2>
          <p className="admin-page__error">{errorMessage}</p>
          {isForbidden ? (
            <p className="admin-page__muted">백엔드의 `ADMIN_ALLOWED_EMAILS`에 현재 이메일을 추가하면 접근할 수 있습니다.</p>
          ) : null}
        </section>
      ) : null}

      {dashboardQuery.data ? (
        <>
          <section className="admin-page__metrics">
            <MetricCard label="총 사용자" value={dashboardQuery.data.metrics.totalUsers} />
            <MetricCard label="총 댓글" value={dashboardQuery.data.metrics.totalComments} />
            <MetricCard label="총 즐겨찾기" value={dashboardQuery.data.metrics.totalFavorites} />
            <MetricCard label="트렌드 수집 런" value={dashboardQuery.data.metrics.totalTrendRuns} />
          </section>

          <section className="admin-page__grid">
            <article className="admin-page__panel">
              <h2 className="admin-page__section-title">활성 시즌</h2>
              {dashboardQuery.data.activeSeason ? (
                <div className="admin-page__detail-list">
                  <p><span>이름</span><strong>{dashboardQuery.data.activeSeason.name}</strong></p>
                  <p><span>상태</span><strong>{dashboardQuery.data.activeSeason.status}</strong></p>
                  <p><span>지역</span><strong>{dashboardQuery.data.activeSeason.regionCode}</strong></p>
                  <p><span>시작</span><strong>{formatDateTime(dashboardQuery.data.activeSeason.startAt)}</strong></p>
                  <p><span>종료</span><strong>{formatDateTime(dashboardQuery.data.activeSeason.endAt)}</strong></p>
                </div>
              ) : (
                <p className="admin-page__muted">현재 활성 시즌이 없습니다.</p>
              )}
            </article>

            <article className="admin-page__panel">
              <h2 className="admin-page__section-title">최신 트렌딩 런</h2>
              {dashboardQuery.data.latestTrendRun ? (
                <>
                  <div className="admin-page__detail-list">
                    <p><span>카테고리</span><strong>{dashboardQuery.data.latestTrendRun.categoryLabel}</strong></p>
                    <p><span>지역</span><strong>{dashboardQuery.data.latestTrendRun.regionCode}</strong></p>
                    <p><span>소스</span><strong>{dashboardQuery.data.latestTrendRun.source}</strong></p>
                    <p><span>수집 시각</span><strong>{formatDateTime(dashboardQuery.data.latestTrendRun.capturedAt)}</strong></p>
                  </div>
                  <TrendList items={dashboardQuery.data.latestTrendRun.topVideos} />
                </>
              ) : (
                <p className="admin-page__muted">아직 수집된 트렌딩 데이터가 없습니다.</p>
              )}
            </article>
          </section>

          <section className="admin-page__panel">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">최근 가입 사용자</h2>
              <span className="admin-page__section-caption">최근 8명</span>
            </div>
            <RecentUsersTable items={dashboardQuery.data.recentUsers} />
          </section>

          <section className="admin-page__panel">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">최근 댓글</h2>
              <span className="admin-page__section-caption">최근 8건</span>
            </div>
            <RecentCommentsTable items={dashboardQuery.data.recentComments} />
          </section>

          <section className="admin-page__panel">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">최근 즐겨찾기 추가</h2>
              <span className="admin-page__section-caption">최근 8건</span>
            </div>
            <RecentFavoritesTable items={dashboardQuery.data.recentFavorites} />
          </section>
        </>
      ) : null}
    </main>
  );
}
