import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api';

function AdminUsersPage() {
  const [usersData, setUsersData] = useState({
    items: [],
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers(1);
  }, []);

  const loadUsers = async (page) => {
    try {
      setLoading(true);
      const data = await API.adminGetUsers(page, 10);
      setUsersData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= usersData.total_pages) {
      loadUsers(newPage);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') {
      return 'bg-primary/15 text-primary border border-primary/25';
    }
    return 'bg-secondary text-secondary-foreground border border-border';
  };

  if (loading && usersData.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Users</h1>
        <p className="text-muted-foreground">
          Showing {usersData.items.length} of {usersData.total} users
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {usersData.items.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">Users will appear here once they register</p>
        </div>
      ) : (
        <>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="admin-users-table">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium">User ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Full Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.items.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      data-testid={`user-row-${user.id}`}
                    >
                      <td className="px-6 py-4 font-mono text-sm">{user.id.slice(0, 12)}...</td>
                      <td className="px-6 py-4 font-medium">{user.email}</td>
                      <td className="px-6 py-4">{user.full_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {usersData.total_pages > 1 && (
            <div className="flex items-center justify-between bg-card rounded-xl border border-border px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Page {usersData.page} of {usersData.total_pages}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(usersData.page - 1)}
                  disabled={usersData.page === 1 || loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="pagination-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, usersData.total_pages) }, (_, i) => {
                    let pageNum;
                    if (usersData.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (usersData.page <= 3) {
                      pageNum = i + 1;
                    } else if (usersData.page >= usersData.total_pages - 2) {
                      pageNum = usersData.total_pages - 4 + i;
                    } else {
                      pageNum = usersData.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === usersData.page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        data-testid={`pagination-page-${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(usersData.page + 1)}
                  disabled={usersData.page === usersData.total_pages || loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="pagination-next"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Stats */}
      {usersData.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{usersData.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {usersData.items.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
