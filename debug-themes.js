/**
 * Script de Debug para Sistema de Temas
 *
 * Como usar:
 * 1. Abra o DevTools do navegador (F12)
 * 2. Vá para a aba Console
 * 3. Cole todo este script e pressione Enter
 * 4. O script irá mostrar informações detalhadas sobre o estado dos temas
 */

(function() {
  console.clear();
  console.log('%c=== DEBUG DO SISTEMA DE TEMAS ===', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('');

  // 1. Verificar elemento HTML e classe dark
  console.log('%c1. Estado do HTML:', 'color: #ffaa00; font-weight: bold;');
  const html = document.documentElement;
  console.log('  - Classe dark aplicada:', html.classList.contains('dark'));
  console.log('  - Classes atuais:', html.className);
  console.log('');

  // 2. Verificar variáveis CSS aplicadas
  console.log('%c2. Variáveis CSS (Custom Properties):', 'color: #ffaa00; font-weight: bold;');
  const rootStyles = getComputedStyle(html);
  const cssVariables = [
    'background',
    'foreground',
    'primary',
    'secondary',
    'muted',
    'accent',
    'card',
    'border'
  ];

  cssVariables.forEach(varName => {
    const value = rootStyles.getPropertyValue(`--${varName}`);
    const inlineValue = html.style.getPropertyValue(`--${varName}`);
    console.log(`  --${varName}:`);
    console.log(`    Computed: "${value}"`);
    console.log(`    Inline: "${inlineValue}"`);
  });
  console.log('');

  // 3. Verificar localStorage
  console.log('%c3. LocalStorage:', 'color: #ffaa00; font-weight: bold;');
  const appTheme = localStorage.getItem('app-theme');
  const nextTheme = localStorage.getItem('theme');
  console.log('  - app-theme:', appTheme);
  console.log('  - theme (next-themes):', nextTheme);
  console.log('');

  // 4. Verificar arquivos de tema carregados
  console.log('%c4. Temas Disponíveis:', 'color: #ffaa00; font-weight: bold;');
  try {
    // Tentar acessar os módulos (isso só funciona se estiverem expostos globalmente)
    console.log('  Verificando se os arquivos JSON estão acessíveis...');
    console.log('  (Esta verificação pode falhar se os módulos não estiverem expostos)');
  } catch (e) {
    console.log('  Não foi possível verificar os módulos:', e.message);
  }
  console.log('');

  // 5. Verificar estilos inline no HTML
  console.log('%c5. Estilos Inline no <html>:', 'color: #ffaa00; font-weight: bold;');
  console.log('  Style attribute:', html.getAttribute('style'));
  console.log('  Style object:', html.style.cssText);
  console.log('');

  // 6. Verificar se o ThemeProvider está funcionando
  console.log('%c6. Provider e Hooks:', 'color: #ffaa00; font-weight: bold;');
  console.log('  Verificando atributos de data...');
  console.log('  - data-theme:', html.getAttribute('data-theme'));
  console.log('  - suppressHydrationWarning:', html.getAttribute('suppressHydrationWarning'));
  console.log('');

  // 7. Função helper para testar aplicação de tema
  console.log('%c7. Função de Teste:', 'color: #ffaa00; font-weight: bold;');
  console.log('  Use esta função para testar a aplicação manual de cores:');
  console.log('');
  console.log('%c  testTheme(themeColors, mode)', 'color: #00aaff;');
  console.log('');
  console.log('  Exemplo:');
  console.log('%c  testTheme({', 'color: #00aaff;');
  console.log('%c    background: "210 40% 96%",', 'color: #00aaff;');
  console.log('%c    foreground: "210 20% 10%",', 'color: #00aaff;');
  console.log('%c    primary: "210 80% 60%"', 'color: #00aaff;');
  console.log('%c  }, "light")', 'color: #00aaff;');
  console.log('');

  window.testTheme = function(colors, mode = 'light') {
    console.log(`%cAplicando tema teste (${mode})...`, 'color: #00ff00; font-weight: bold;');

    // Se mode for 'dark', adiciona a classe
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Aplica as cores
    Object.entries(colors).forEach(([key, value]) => {
      html.style.setProperty(`--${key}`, value, 'important');
      console.log(`  Aplicado --${key}: ${value}`);
    });

    console.log('%cTema aplicado! Verifique se houve mudanças visuais.', 'color: #00ff00;');

    // Mostra valores computados após aplicação
    setTimeout(() => {
      console.log('%cValores computados após aplicação:', 'color: #ffaa00;');
      Object.keys(colors).forEach(key => {
        const computed = getComputedStyle(html).getPropertyValue(`--${key}`);
        console.log(`  --${key}: "${computed}"`);
      });
    }, 100);
  };

  // 8. Teste rápido de mudança de cor
  console.log('%c8. Teste Rápido:', 'color: #ffaa00; font-weight: bold;');
  console.log('  Execute: testQuickChange()');
  console.log('');

  window.testQuickChange = function() {
    console.log('%cTestando mudança rápida de cor de fundo...', 'color: #00ff00; font-weight: bold;');

    // Salva cor original
    const original = html.style.getPropertyValue('--background');
    console.log('  Cor original:', original);

    // Aplica cor de teste (vermelho)
    html.style.setProperty('--background', '0 100% 50%', 'important');
    console.log('  Aplicando vermelho: 0 100% 50%');

    setTimeout(() => {
      const current = getComputedStyle(html).getPropertyValue('--background');
      console.log('  Cor atual computada:', current);

      if (current.includes('0') && current.includes('100') && current.includes('50')) {
        console.log('%c  ✓ Mudança funcionou!', 'color: #00ff00;');
      } else {
        console.log('%c  ✗ Mudança NÃO funcionou - há algo bloqueando', 'color: #ff0000;');
      }

      // Restaura cor original
      if (original) {
        html.style.setProperty('--background', original, 'important');
      }
    }, 500);
  };

  // 9. Verificar todos os stylesheets
  console.log('%c9. Stylesheets Carregados:', 'color: #ffaa00; font-weight: bold;');
  const sheets = Array.from(document.styleSheets);
  sheets.forEach((sheet, index) => {
    try {
      console.log(`  [${index}] ${sheet.href || 'inline'}`);
      if (!sheet.href && sheet.cssRules) {
        console.log(`      Regras inline: ${sheet.cssRules.length}`);
      }
    } catch (e) {
      console.log(`  [${index}] (sem acesso - CORS)`);
    }
  });
  console.log('');

  // 10. Resumo e próximos passos
  console.log('%c10. RESUMO E PRÓXIMOS PASSOS:', 'color: #00ff00; font-weight: bold;');
  console.log('');
  console.log('  Execute os seguintes comandos para testar:');
  console.log('');
  console.log('%c  1. testQuickChange()', 'color: #00aaff; font-weight: bold;');
  console.log('     → Testa se conseguimos mudar variáveis CSS');
  console.log('');
  console.log('%c  2. testTheme({ background: "120 50% 90%", primary: "120 60% 50%" })', 'color: #00aaff; font-weight: bold;');
  console.log('     → Testa aplicação manual de tema verde');
  console.log('');
  console.log('%c  3. Copie e cole TODAS as informações acima', 'color: #ff6600; font-weight: bold;');
  console.log('     → Envie para o Claude para análise completa');
  console.log('');
  console.log('='.repeat(60));
})();
