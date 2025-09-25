<!--
Sync Impact Report:
- Version change: none → 1.0.0 (initial constitution)
- Modified principles: Initial creation of 5 core principles
- Added sections: Development Workflow, Quality Gates
- Removed sections: none
- Templates requiring updates: ✅ All templates already aligned
- Follow-up TODOs: none
-->

# Checker Constitution

## Core Principles

### I. Specification-First Development
Every feature MUST begin with a complete specification before any implementation. Specifications MUST define user scenarios, functional requirements, and acceptance criteria. No code shall be written without an approved spec.md file containing testable requirements.

*Rationale: Prevents scope creep, ensures user-focused development, and provides clear success criteria before implementation begins.*

### II. Test-Driven Development (NON-NEGOTIABLE)
All implementations MUST follow strict TDD: Tests written → Tests fail → Implementation → Tests pass. Contract tests MUST be created for all APIs. Integration tests MUST validate user scenarios. No implementation task begins until corresponding tests exist and fail.

*Rationale: Ensures code quality, validates requirements, and prevents regression while maintaining the specification-first approach.*

### III. Template-Based Consistency
All development artifacts MUST follow established templates in `.specify/templates/`. Specifications use spec-template.md, implementation plans use plan-template.md, and tasks use tasks-template.md. Templates ensure consistency across features and enable automated tooling.

*Rationale: Standardizes deliverables, reduces cognitive overhead, and enables automated validation and processing.*

### IV. Agent-Guided Development
Development workflows MUST leverage agent-specific guidance files (CLAUDE.md, .github/copilot-instructions.md) to maintain context and conventions. Agent files MUST be updated incrementally with each feature to preserve institutional knowledge.

*Rationale: Ensures AI assistants maintain project context, follow established patterns, and contribute effectively to the codebase.*

### V. Phased Implementation
All features MUST progress through defined phases: Specification → Planning → Research → Design → Tasks → Implementation → Validation. Each phase MUST complete its gates before proceeding. Constitution compliance MUST be verified at specification and design phases.

*Rationale: Ensures thorough planning, prevents rework, and maintains quality gates throughout the development lifecycle.*

## Development Workflow

Features progress through slash commands that enforce constitutional principles:

- `/specify`: Create feature specifications following spec-template.md
- `/clarify`: Resolve ambiguities before planning begins
- `/plan`: Generate technical approach and design documents
- `/tasks`: Create ordered, testable implementation tasks
- `/implement`: Execute tasks while maintaining TDD discipline

Each phase includes constitutional compliance checks. Violations MUST be justified in complexity tracking or the approach simplified.

## Quality Gates

### Specification Gate
- All functional requirements are testable and unambiguous
- No [NEEDS CLARIFICATION] markers remain in spec.md
- User scenarios define clear acceptance criteria
- Scope is bounded and dependencies identified

### Design Gate
- Constitution compliance verified for complexity and patterns
- API contracts generated for all user actions
- Data model entities defined with validation rules
- Contract tests created and failing before implementation

### Implementation Gate
- TDD cycle followed: failing tests before implementation
- All tasks specify exact file paths to prevent conflicts
- Parallel tasks marked [P] operate on independent files
- Agent guidance files updated with new patterns learned

## Governance

This constitution supersedes all other development practices. All feature development MUST comply with these principles. Amendments require documentation of rationale, version increment following semantic versioning, and update of dependent templates.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25