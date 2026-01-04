# Contributing to Amanat-E-Nazirpara Masjid Management System

Thank you for your interest in contributing to the Amanat-E-Nazirpara Masjid Management System! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/amanat-e-nazirpara/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Check existing feature requests in [Issues](https://github.com/yourusername/amanat-e-nazirpara/issues)
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our coding standards:
   - Use TypeScript with proper types
   - Follow existing code style
   - Write clear commit messages
   - Add comments for complex logic
   - Update documentation if needed

4. Test your changes thoroughly:
   ```bash
   pnpm dev
   pnpm build
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with:
   - Clear title and description
   - Link to related issues
   - Screenshots/videos if applicable
   - Test results

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow functional component patterns
- Use meaningful variable names
- Keep functions small and focused
- Avoid code duplication

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(admin): add user role management
fix(gallery): resolve image upload issue
docs(readme): update installation steps
```

### Testing

- Test all changes locally before submitting
- Ensure no console errors
- Test on different screen sizes
- Verify database operations
- Check authentication flows

## Questions?

Feel free to open an issue or contact the maintainers.

Thank you for contributing! 🙏
