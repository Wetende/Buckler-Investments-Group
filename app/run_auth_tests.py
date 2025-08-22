#!/usr/bin/env python3
"""
Test runner for authentication system.

This script runs all authentication-related tests and provides a comprehensive report.
"""
import subprocess
import sys
import os
from pathlib import Path


def run_command(command, description):
    """Run a command and return success status."""
    print(f"\n{'='*60}")
    print(f"🧪 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        print("✅ PASSED")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("❌ FAILED")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False


def main():
    """Run all authentication tests."""
    print("🚀 Buckler Investment Group - Authentication Test Suite")
    print("Testing user registration, login, security, and profile management")
    
    # Test commands
    test_commands = [
        # Unit Tests - Domain Layer
        (
            "python -m pytest tests/unit/domain/test_user_entity.py -v",
            "Unit Tests: User Domain Entity Business Logic"
        ),
        
        # Unit Tests - Application Layer
        (
            "python -m pytest tests/unit/application/use_cases/user/test_create_user_use_case.py -v",
            "Unit Tests: Create User Use Case Logic"
        ),
        
        # API Tests
        (
            "python -m pytest tests/api/auth/test_auth_api_endpoints.py -v",
            "API Tests: Authentication Endpoints HTTP Behavior"
        ),
        
        # Integration Tests
        (
            "python -m pytest tests/integration/auth/test_user_registration_integration.py -v",
            "Integration Tests: User Registration Full Flow"
        ),
        
        (
            "python -m pytest tests/integration/auth/test_authentication_integration.py -v",
            "Integration Tests: Authentication and Login Flow"
        ),
        
        # Security Tests
        (
            "python -m pytest tests/security/test_authentication_security.py -v",
            "Security Tests: Password Hashing, JWT, and Vulnerability Prevention"
        ),
        
        # Coverage Report
        (
            "python -m pytest tests/unit/application/use_cases/user/ tests/unit/domain/ tests/api/auth/ tests/integration/auth/ tests/security/ --cov=application.use_cases.user --cov=domain.entities.user --cov=infrastructure.config.auth --cov-report=term-missing",
            "Test Coverage Report for Authentication Components"
        ),
    ]
    
    # Track results
    passed_tests = 0
    failed_tests = 0
    
    for command, description in test_commands:
        if run_command(command, description):
            passed_tests += 1
        else:
            failed_tests += 1
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    print(f"📈 Total: {passed_tests + failed_tests}")
    
    if failed_tests == 0:
        print("\n🎉 All authentication tests passed! Your auth system is ready.")
        return 0
    else:
        print(f"\n⚠️  {failed_tests} test suite(s) failed. Please review the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

