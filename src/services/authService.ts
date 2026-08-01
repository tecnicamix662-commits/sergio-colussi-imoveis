/**
 * AuthService - Gerencia as credenciais de login do Administrador e a autenticação.
 */

export interface AdminCredentials {
  email: string;
  passwordHash: string; // Senha salva
  adminName: string;
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  email: 'admin@colussi.com.br',
  passwordHash: 'admin123',
  adminName: 'Sérgio Colussi',
};

const AUTH_CREDENTIALS_KEY = 'sergio_colussi_admin_credentials';
const AUTH_SESSION_KEY = 'sergio_colussi_admin_auth';

export class AuthService {
  /**
   * Obtém as credenciais cadastradas
   */
  static getCredentials(): AdminCredentials {
    if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
    try {
      const saved = localStorage.getItem(AUTH_CREDENTIALS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CREDENTIALS;
  }

  /**
   * Verifica se o e-mail e senha estão corretos
   */
  static login(emailInput: string, passwordInput: string): boolean {
    const creds = this.getCredentials();
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (cleanEmail === creds.email.toLowerCase() && passwordInput === creds.passwordHash) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify({ user: creds.adminName, email: creds.email, role: 'admin', timestamp: Date.now() })
        );
      }
      return true;
    }
    return false;
  }

  /**
   * Altera o e-mail e/ou a senha de acesso
   */
  static changePassword(
    currentPassword: string,
    newEmail: string,
    newPassword: string
  ): { success: boolean; message: string } {
    const creds = this.getCredentials();

    if (currentPassword !== creds.passwordHash) {
      return { success: false, message: 'A senha atual informada está incorreta.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    const updatedCreds: AdminCredentials = {
      ...creds,
      email: newEmail.trim() || creds.email,
      passwordHash: newPassword,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(updatedCreds));
    }

    return { success: true, message: 'Credenciais e senha de acesso atualizadas com sucesso!' };
  }

  /**
   * Verifica se há uma sessão de login ativa
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_SESSION_KEY);
  }

  /**
   * Encerra a sessão
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }
}
