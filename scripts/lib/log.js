// Shared console output for the scripts in scripts/.
//
// The house style, so every script reads the same way:
//
//   generate-plugins: registering unpackaged skills          <- what is running
//     + 29 entries added                                     <- what changed
//       analyzing-quality-metrics, auditing-accessibility, …  <- the items, wrapped
//     ↳ 29 descriptions came from skill frontmatter           <- a note about the change
//   ⚠ 2 warnings                                             <- grouped, capped
//   generate-plugins: OK (29 added, 6 unchanged)              <- one-line verdict
//   → next: npm run plugin:materialize                        <- what to run now
//
// Rules that follow from it:
//   - one verdict line per script, always prefixed with the script name
//   - long lists are counted and truncated; --verbose prints every item
//   - warnings and errors are grouped at the end, not interleaved with progress
//   - color is decoration only; every line reads the same in a plain CI log

const LIST_LIMIT = 12;
const ISSUE_LIMIT = 15;

const colorEnabled =
  !process.env.NO_COLOR &&
  process.env.TERM !== 'dumb' &&
  (process.env.FORCE_COLOR ? process.env.FORCE_COLOR !== '0' : Boolean(process.stdout.isTTY));

function paint(code) {
  return (text) => (colorEnabled ? `\u001b[${code}m${text}\u001b[0m` : String(text));
}

const style = {
  bold: paint('1'),
  dim: paint('2'),
  red: paint('31'),
  green: paint('32'),
  yellow: paint('33'),
  cyan: paint('36'),
};

// Wrap a comma-separated list to the terminal width, indented under its heading.
function wrapList(items, indent) {
  const width = Math.max(40, (process.stdout.columns || 100) - indent.length);
  const lines = [];
  let current = '';
  for (const item of items) {
    const piece = current ? `${current}, ${item}` : item;
    if (piece.length > width && current) {
      lines.push(current + ',');
      current = item;
    } else {
      current = piece;
    }
  }
  if (current) lines.push(current);
  return lines.map((line) => indent + line);
}

function isVerbose(argv = process.argv) {
  return argv.includes('--verbose') || argv.includes('-v');
}

function createLogger(scriptName, { verbose = isVerbose() } = {}) {
  const log = {
    verbose,

    // What the run is doing, before any output about results.
    intro(text) {
      console.log(`${style.bold(scriptName)}: ${text}`);
    },

    // A change: something was written, copied, or removed.
    change(symbol, text, detail) {
      const tail = detail ? ` ${style.dim(detail)}` : '';
      console.log(`  ${symbol} ${text}${tail}`);
    },
    added(text, detail) {
      log.change(style.green('+'), text, detail);
    },
    removed(text, detail) {
      log.change(style.yellow('-'), text, detail);
    },
    kept(text, detail) {
      log.change(style.dim('='), text, detail);
    },

    // A remark attached to the change above it.
    note(text) {
      console.log(`    ${style.dim(`↳ ${text}`)}`);
    },

    // Detail only worth printing when asked for.
    detail(text) {
      if (verbose) console.log(`    ${style.dim(text)}`);
    },

    // A list of names under a change line: counted, truncated unless --verbose.
    names(items, { indent = '      ' } = {}) {
      if (!items.length) return;
      const shown = verbose ? items : items.slice(0, LIST_LIMIT);
      for (const line of wrapList(shown, indent)) console.log(style.dim(line));
      const hidden = items.length - shown.length;
      if (hidden > 0) {
        console.log(style.dim(`${indent}… and ${hidden} more (--verbose to list)`));
      }
    },

    // Warnings and errors, grouped, then the verdict. Exits the process.
    finish({ errors = [], warnings = [], ok = '', next = [] } = {}) {
      log.issues(warnings, style.yellow('⚠'), 'warning');
      log.issues(errors, style.red('✖'), 'error');

      if (errors.length) {
        const counts = `${errors.length} error(s)`;
        const withWarnings = warnings.length ? `, ${warnings.length} warning(s)` : '';
        console.error(`${style.bold(scriptName)}: ${style.red(`FAILED — ${counts}${withWarnings}`)}`);
        process.exit(1);
      }

      if (ok) {
        const suffix = warnings.length ? ` ${style.dim(`(${warnings.length} warning(s))`)}` : '';
        console.log(`${style.bold(scriptName)}: ${style.green('OK')} ${ok}${suffix}`);
      }
      for (const command of next) {
        console.log(style.cyan(`→ next: ${command}`));
      }
      process.exit(0);
    },

    issues(items, symbol, label) {
      if (!items.length) return;
      const write = label === 'error' ? console.error : console.warn;
      const shown = verbose ? items : items.slice(0, ISSUE_LIMIT);
      write('');
      for (const item of shown) write(`${symbol} ${item}`);
      const hidden = items.length - shown.length;
      if (hidden > 0) write(style.dim(`  … and ${hidden} more ${label}(s) (--verbose to list)`));
      write('');
    },
  };

  return log;
}

module.exports = { createLogger, isVerbose, style, wrapList };
