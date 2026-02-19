# Contributing Guidelines

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   - Test frontend changes in browser
   - Test backend API endpoints
   - Verify ML service responses

4. **Commit your changes**
   ```bash
   git commit -m "Description of changes"
   ```

5. **Push and create pull request**

## Code Style

### Frontend (TypeScript/React)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Use Tailwind CSS for styling
- Component files should be PascalCase

### Backend (Node.js/Express)
- Use async/await for async operations
- Handle errors properly
- Validate input with express-validator
- Use meaningful variable names

### ML Service (Python)
- Follow PEP 8 style guide
- Add docstrings to functions
- Use type hints where possible
- Keep functions focused and small

## Adding New Features

### Frontend
1. Create component in appropriate directory
2. Add route if needed in `app/` directory
3. Update navigation if needed
4. Add API calls in `lib/api.ts` if needed

### Backend
1. Create route file in `routes/` directory
2. Add middleware if needed
3. Update `server.js` to include new routes
4. Add database queries if needed

### ML Service
1. Add new endpoint in `app.py`
2. Create request/response models
3. Implement ML logic
4. Update documentation

## Database Changes

1. Create migration file in `database/migrations/`
2. Update `schema.sql` if needed
3. Document changes in migration file
4. Test migration on development database

## Testing

- Test all user flows
- Verify error handling
- Check edge cases
- Test with different data scenarios

## Questions?

Open an issue or contact the maintainers.
