#[macro_use]
mod utils;

inject_dependencies!();

use indy_vdr::common::did::DidValue;
use indy_vdr::ledger::constants;

use crate::utils::fixtures::*;
use crate::utils::pool::TestPool;
use crate::utils::crypto::Identity;

#[test]
fn empty() {
    // Empty test to run module
}

#[cfg(test)]
mod builder {
    use super::*;
    use indy_vdr::ledger::RequestBuilder;

    mod validator_info {
        use super::*;
        use crate::utils::helpers::check_request_operation;

        #[rstest]
        fn test_get_validator_info_request(request_builder: RequestBuilder,
                                           trustee_did: DidValue) {
            let request =
                request_builder
                    .build_get_validator_info_request(&trustee_did).unwrap();

            let expected_operation = json!({
                "type": constants::GET_VALIDATOR_INFO,
            });

            check_request_operation(&request, expected_operation);
        }
    }
}

#[cfg(test)]
mod send_get_validator_info {
    use super::*;

    #[rstest]
    fn test_pool_get_validator_info_request(pool: TestPool, trustee: Identity) {
        // Send Get Validator Info
        let mut request =
            pool.request_builder()
                .build_get_validator_info_request(&trustee.did).unwrap();

        trustee.sign_request(&mut request);

        let _replies = pool.send_full_request(&request, None, None).unwrap();
        println!("{:?}", _replies);
    }
}